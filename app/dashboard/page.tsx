"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, where } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

import { db, auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

type Report = {
  id: string
  title: string
  location: string
  status: string
  createdAt: Date
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user.uid)
        )

        const snap = await getDocs(q)

        const data: Report[] = snap.docs.map((doc) => {
          const d = doc.data()
          return {
            id: doc.id,
            title: d.description,
            location: d.location,
            status: d.status,
            createdAt: d.createdAt?.toDate?.() ?? new Date(),
          }
        })

        // SORT LOCALLY (no index needed)
        data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

        setReports(data)
      } catch (e) {
        console.error("Dashboard fetch failed:", e)
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  const active = reports.filter(r => r.status === "open" || r.status === "in-progress").length
  const pending = reports.filter(r => r.status === "pending").length
  const resolved = reports.filter(r => r.status === "resolved").length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Overview
        </h1>
        <p className="text-neutral-500">Welcome back, Student.</p>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 border-b border-neutral-200 pb-12">
        <div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider">
            Active Issues
          </div>
          <div className="text-3xl font-semibold">{active}</div>
        </div>

        <div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider">
            Pending Review
          </div>
          <div className="text-3xl font-semibold">{pending}</div>
        </div>

        <div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider">
            Resolved
          </div>
          <div className="text-3xl font-semibold">{resolved}</div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mb-12">
        <h2 className="text-sm font-medium text-neutral-900 mb-4 uppercase tracking-wider">
          Actions
        </h2>
        <div className="flex gap-4">
          <Button
            className="h-12 px-6 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
            asChild
          >
            <Link href="/report">Report New Issue</Link>
          </Button>

          <Button
            variant="outline"
            className="h-12 px-6 rounded-full border-neutral-300"
            asChild
          >
            <Link href="/issues">View All History</Link>
          </Button>
        </div>
      </div>

      {/* RECENT UPDATES */}
      <section>
        <h2 className="text-sm font-medium text-neutral-900 mb-6 uppercase tracking-wider">
          Recent Updates
        </h2>

        {loading && <p className="text-sm text-neutral-500">Loading…</p>}

        {!loading && reports.length === 0 && (
          <p className="text-sm text-neutral-500">
            No issues reported yet.
          </p>
        )}

        <div className="divide-y divide-neutral-200">
          {reports.slice(0, 5).map((r) => (
            <div key={r.id} className="py-4 flex justify-between items-center group">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-neutral-400">
                  #{r.id.slice(0, 4)}
                </span>
                <div>
                  <div className="font-medium text-neutral-900 group-hover:underline">
                    {r.title}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {r.location}
                  </div>
                </div>
              </div>

              <Link
                href={`/issues/${r.id}`}
                className="p-2 text-neutral-300 hover:text-neutral-900"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
