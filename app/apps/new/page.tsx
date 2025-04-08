"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    appId: string;
    // ... other fields
  };
}

export default function NewApiAppPage() {
  const [name, setName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  // const [timeoutt, setTimeoutt] = useState<number>(30000)
  const [requestsPerWindow, setRequestsPerWindow] = useState("100")
  const [windowInSeconds, setWindowInSeconds] = useState("60")
  const [rateLimitStrategy, setRateLimitStrategy] = useState<"window" | "token-bucket">("window")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please login to access this page")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please login to access this page")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
        return
      }

      const res = await fetch("http://localhost:3002/api/apps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          baseUrl,
          // timeoutt,
          requestsPerWindow: Number.parseInt(requestsPerWindow),
          windowInSeconds: Number.parseInt(windowInSeconds),
          rateLimitStrategy,
        }),
      })

      const data = await res.json()
      setResponse(data)

      if (res.ok) {
        toast("API app created", {
          description: "API app created successfully",
        })
        router.push("/dashboard")
      } else {
        setError(data.message || "Failed to create API app")
      }
    } catch (error) {
      setError("Could not connect to server")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (error && !isLoading) {
    return (
      <div className="container py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New API App</h1>
        <Button variant="outline" asChild className="mr-4">
          <Link href="/dashboard">Back</Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>New API Application</CardTitle>
          <CardDescription>Create a new API application to manage rate limiting for a third-party API</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Application Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My API App"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
                required
              />
              <p className="text-sm text-muted-foreground">The base URL of the third-party API you want to proxy</p>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requestsPerWindow">Requests Per Window</Label>
                <Input
                  id="requestsPerWindow"
                  type="number"
                  min="1"
                  value={requestsPerWindow}
                  onChange={(e) => setRequestsPerWindow(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="windowInSeconds">Window (seconds)</Label>
                <Input
                  id="windowInSeconds"
                  type="number"
                  min="1"
                  value={windowInSeconds}
                  onChange={(e) => setWindowInSeconds(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="timeoutt">Timeout Duration(in ms)</Label>
              <Input
                id="timeoutt"
                value={(timeoutt)}
                onChange={(e) => setTimeoutt(parseInt(e.target.value))}
                placeholder="30"
                required
              />
              <p className="text-sm text-muted-foreground">The number of milli seconds that you will want your requests to remain open.</p>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="rateLimitStrategy">Rate Limit Strategy</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={rateLimitStrategy === "window" ? "default" : "outline"}
                  onClick={() => setRateLimitStrategy("window")}
                  className="w-full"
                >
                  Window
                </Button>
                <Button
                  type="button"
                  variant={rateLimitStrategy === "token-bucket" ? "default" : "outline"}
                  onClick={() => setRateLimitStrategy("token-bucket")}
                  className="w-full"
                >
                  Token Bucket
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose between window-based or token bucket rate limiting strategy
              </p>
            </div>

            {response && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <pre className="text-xs overflow-auto">{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create API App"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

