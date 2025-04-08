"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/user-profile";
import { ApiAppsList } from "@/components/api-apps-list";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);

  const fetchApiKey = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3002/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setApiKey(data.apiKey);
      localStorage.setItem("apiKey",data.apiKey)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Please login to access this page");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      const apiKey = localStorage.getItem("apiKey");
      if (apiKey === null || apiKey === undefined) {
        fetchApiKey(token);
      } else {
        setApiKey(apiKey);
      }
      setIsLoading(false);
    }
  }, [router]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("apiKey")
    toast("Logged out", {
      description: "You have been logged out successfully",
    });
    router.push("/login");
  };

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rate Limiting Proxy Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs defaultValue="apps">
        <div className="flex justify-between items-center">
          <TabsList className="mb-6">
            <TabsTrigger value="apps">API Apps</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <p className="">
            User Api Key:{" "}
            <span className="border p-2 rounded-lg bg-gray-100 text-black select-all">
              {apiKey}
            </span>
          </p>
        </div>

        <TabsContent value="apps">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your API Applications</h2>
            <Button asChild>
              <Link href="/apps/new">Create New API App</Link>
            </Button>
          </div>
          <ApiAppsList />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfile />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
