"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export function UserProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Not authenticated")
          return
        }

        const response = await fetch("http://localhost:3002/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setProfile(data)
        } else {
          setError(data.message || "Failed to fetch profile")
          toast("Error",{
            description: data.message || "Failed to fetch profile",
          })
        }
      } catch (err) {
        setError("Could not connect to server")
        toast("Error",{
          description: "Could not connect to server",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (isLoading) {
    return <div>Loading profile...</div>
  }

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {profile && (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Phone Number</h3>
            <p>{profile.phoneNumber}</p>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Raw Response:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

