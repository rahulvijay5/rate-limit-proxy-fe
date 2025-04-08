"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiAppDetails {
  id: string;
  name: string;
  baseUrl: string;
  requestsPerWindow: number;
  windowInSeconds: number;
  appId: string;
  timeout?: number;
  rateLimitStrategy: "window" | "token-bucket";
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: ApiAppDetails;
}

export default function EditApiAppPage() {
  const [name, setName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [requestsPerWindow, setRequestsPerWindow] = useState("")
  const [windowInSeconds, setWindowInSeconds] = useState("")
  const [timeout, setTimeout] = useState("")
  const [rateLimitStrategy, setRateLimitStrategy] = useState<"window" | "token-bucket">("window")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [id,setId]=useState<string>("")
  const [appDetails, setAppDetails] = useState<ApiAppDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const appId = params.appId as string

  useEffect(() => {
    // Check if user is logged in
    const apiKey = localStorage.getItem("apiKey")
    if (!apiKey) {
      setError("Please login to access this page")
      window.setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    // Fetch API app details
    const fetchAppDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/apps/appId/${appId}`, {
          headers: {
            'x-api-key': apiKey,  
          },
        })

        const data = await res.json()
        setAppDetails(data)

        if (res.ok) {
          setName(data.name)
          setBaseUrl(data.baseUrl)
          setRequestsPerWindow(data.requestsPerWindow.toString())
          setWindowInSeconds(data.windowInSeconds.toString())
          setId(data.id)
          if (data.timeout) {
            setTimeout(data.timeout.toString())
          }
          if(data.rateLimitStrategy == "TOKEN_BUCKET"){
            setRateLimitStrategy("token-bucket")
          }else{
            setRateLimitStrategy("window")
          }
        } else {
          setError(data.message || "Failed to fetch API app details")
        }
      } catch (err) {
        setError("Could not connect to server")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppDetails()
  }, [appId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const apiKey = localStorage.getItem("apiKey")
      if (!apiKey) {
        setError("Please login to access this page")
        window.setTimeout(() => {
          router.push("/login")
        }, 2000)
        return
      }

      const res = await fetch(`http://localhost:3002/api/apps/${id}`, {
        method: "PUT",
        headers: {
          'x-api-key': apiKey,  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          baseUrl,
          requestsPerWindow: Number.parseInt(requestsPerWindow),
          windowInSeconds: Number.parseInt(windowInSeconds),
          timeout: timeout ? Number.parseInt(timeout) : undefined,
          rateLimitStrategy,
        }),
      })
      console.log(name)

      const data = await res.json()
      console.log(data)
      setResponse(data)

      if (res.ok) {
        toast("API app updated", {
          description: "API app updated successfully",
        })
        router.push("/dashboard")
      } else {
        setError(data.message || "Failed to update API app")
      }
    } catch (err) {
      setError("Could not connect to server")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" asChild className="mr-4">
            <Link href="/dashboard">Back</Link>
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  if (error && !isSaving) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="outline" asChild className="mr-4">
            <Link href="/dashboard">Back</Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit API App</h1>
        </div>
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit API App</h1>
        <Button variant="outline" asChild className="mr-4">
          <Link href="/dashboard">Back</Link>
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit API Application</CardTitle>
          <CardDescription>Update your API application settings</CardDescription>
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
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                min="0"
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
                placeholder="Optional"
              />
              <p className="text-sm text-muted-foreground">Optional timeout for API requests in milliseconds</p>
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

            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">API App Details:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(appDetails, null, 2)}</pre>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

