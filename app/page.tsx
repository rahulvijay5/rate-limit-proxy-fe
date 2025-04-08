import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  // Check if user is logged in, if yes redirect to dashboard
  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token")

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Rate Limiting Proxy API</CardTitle>
          <CardDescription>Manage rate limits for your third-party API integrations</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

