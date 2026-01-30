"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setLoading(true)

      // 1️⃣ Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      // 2️⃣ Save display name
      await updateProfile(result.user, {
        displayName: name,
      })

      // 3️⃣ Redirect to login
      router.push("/login")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Visual */}
      <div className="hidden lg:block relative bg-muted order-2 lg:order-1">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-4 text-center">
            <div className="text-3xl font-bold tracking-tight text-primary">
              Start Reporting
            </div>
            <p className="text-muted-foreground text-lg">
              Create an account to track your issues and receive real-time updates.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-24 bg-background order-1 lg:order-2">
        <Link
          href="/login"
          className="absolute top-8 right-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Link>

        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your details below to get started.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>University Email</Label>
              <Input
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
              onClick={handleRegister}
              disabled={!name || !email || !password || loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
