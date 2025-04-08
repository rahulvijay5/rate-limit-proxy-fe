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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [appDetails, setAppDetails] = useState<ApiAppDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please login to access this page")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
      return
    }

    // Fetch API app details
    const fetchAppDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3002/api/apps/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setAppDetails(data)

        if (res.ok) {
          setName(data.name)
          setBaseUrl(data.baseUrl)
          setRequestsPerWindow(data.requestsPerWindow.toString())
          setWindowInSeconds(data.windowInSeconds.toString())
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
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
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

      const res = await fetch(`http://localhost:3002/api/apps/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          baseUrl,
          requestsPerWindow: Number.parseInt(requestsPerWindow),
          windowInSeconds: Number.parseInt(windowInSeconds),
        }),
      })

      const data = await res.json()
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
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4">
          <Link href="/dashboard">Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit API App (Not maintained)</h1>
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

