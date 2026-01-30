"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

import { auth } from "@/lib/firebase"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth"

export default function LoginPage() {
  const router = useRouter()
  const provider = new GoogleAuthProvider()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // EMAIL + PASSWORD LOGIN
  const handleEmailLogin = async () => {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-24 bg-background">
        <Link
          href="/"
          className="absolute top-8 left-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* EMAIL LOGIN */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
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
              onClick={handleEmailLogin}
              disabled={!email || !password || loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          {/* DIVIDER */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* GOOGLE LOGIN */}
          <Button
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-2"
            type="button"
            onClick={handleGoogleLogin}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-4 text-center">
            <div className="text-3xl font-bold tracking-tight text-primary">
              Smart Campus
            </div>
            <p className="text-muted-foreground text-lg">
              Join thousands of students making their campus safer and better
              every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
