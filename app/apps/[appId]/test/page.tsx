"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

export default function TestApiPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("test")
  const params = useParams()
  const appId = params.appId as string
  const apiKey = localStorage.getItem("apiKey")

  const handleTest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!apiKey) {
        setError("Please login to access this page")
        return
      }

      const res = await fetch(`http://localhost:3002/apis/${appId}`, {
        headers: {
          "x-api-key": apiKey,
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Test API Endpoint</h1>
        <Button variant="outline" asChild className="mr-4">
          <Link href={`/dashboard`}>Back</Link>
        </Button>
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="test">Test API</TabsTrigger>
              <TabsTrigger value="curl">CURL Command</TabsTrigger>
            </TabsList>
            <TabsContent value="test" className="space-y-4">
              <Button onClick={handleTest} className="self-center w-full" disabled={isLoading}>
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
            </TabsContent>
            <TabsContent value="curl">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-medium mb-2">CURL Command:</h3>
                <pre className="text-xs overflow-auto select-all bg-white p-2 rounded">
                  {`curl -X GET http://localhost:3002/apis/${appId} \\
  -H "x-api-key: ${apiKey}"`}
                </pre>
                {/* <p className="text-sm text-muted-foreground mt-2">
                  Replace YOUR_API_KEY with your actual API key from the dashboard.
                </p> */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 