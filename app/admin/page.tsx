"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import { AnimatedCard } from "@/components/ui/animated-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  Timestamp
} from "firebase/firestore"

/* ---------------- TYPES ---------------- */

interface Report {
  id: string
  category: string
  description: string
  status: string
  userId?: string
  createdAt?: Timestamp
}

/* ---------------- PAGE ---------------- */

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const fetchReports = async () => {
      const snap = await getDocs(collection(db, "reports"))
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[]

      setReports(data)
      setLoading(false)
    }

    fetchReports()
  }, [])

  /* ---------- STATS ---------- */
  const totalIssues = reports.length

  const resolvedToday = reports.filter(r => {
    if (!r.createdAt) return false
    const today = new Date()
    const created = r.createdAt.toDate()
    return (
      r.status === "resolved" &&
      created.toDateString() === today.toDateString()
    )
  }).length

  const criticalAlerts = reports.filter(
    r => r.status === "urgent"
  ).length

  /* ---------- CATEGORY CHART DATA ---------- */
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}

    reports.forEach(r => {
      map[r.category] = (map[r.category] || 0) + 1
    })

    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }))
  }, [reports])

  /* ---------- SAFE HELPERS ---------- */
  const shortUser = (id?: string) =>
    id ? id.slice(0, 6) : "Unknown"

  /* ---------- UI ---------- */
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Admin Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor campus health and issue resolution metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Export Report</Button>
          <Button asChild>
            <Link href="/admin/heatmap">View Heatmap</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Issues" value={totalIssues} icon={BarChart3} />
        <StatsCard title="Resolved Today" value={resolvedToday} icon={CheckCircle2} />
        <StatsCard title="Critical Alerts" value={criticalAlerts} icon={AlertTriangle} />
        <StatsCard title="Avg Resolution" value="—" icon={Clock} />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Recent Activity
          </h2>

          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : reports.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No reports yet.
            </p>
          ) : (
            reports.slice(0, 5).map((r, i) => (
              <AnimatedCard
                key={r.id}
                delay={i * 0.05}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <div className="font-medium">
                    {r.category} Issue
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Reported by {shortUser(r.userId)}
                  </div>
                </div>

                <Badge
                  variant={
                    r.status === "resolved"
                      ? "success"
                      : r.status === "urgent"
                      ? "destructive"
                      : "open"
                  }
                >
                  {r.status}
                </Badge>
              </AnimatedCard>
            ))
          )}
        </div>

        {/* Categories Chart */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Categories
          </h2>

          <AnimatedCard className="h-[400px] p-4">
            {categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    fill="currentColor"
                    className="text-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

/* ---------------- STATS CARD ---------------- */

function StatsCard({
  title,
  value,
  icon: Icon
}: {
  title: string
  value: number | string
  icon: any
}) {
  return (
    <AnimatedCard>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-3xl font-bold tracking-tight mb-1">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">
        {title}
      </div>
    </AnimatedCard>
  )
}
