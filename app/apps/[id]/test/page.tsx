"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestApiPage() {
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const id = params.id as string

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please login to access this page")
        return
      }

      const res = await fetch(`http://localhost:3002/apis/${id}`, {
        headers: {
          "x-api-key": token,
        },
      })

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError("Could not connect to server")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4">
          <Link href={`/apps/dashboard`}>Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Test API Endpoint</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test API</CardTitle>
          <CardDescription>Test your API endpoint with a GET request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-medium mb-2">CURL Command:</h3>
            <pre className="text-xs overflow-auto select-all bg-white p-2 rounded">
              {`curl -X GET http://localhost:3002/apis/${id} \\
  -H "x-api-key: YOUR_API_KEY"`}
            </pre>
          </div>

          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? "Testing..." : "Test API"}
          </Button>

          {response && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Response:</h3>
              <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 