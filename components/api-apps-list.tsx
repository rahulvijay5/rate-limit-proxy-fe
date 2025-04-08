"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash, Edit, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiApp {
  id: string;
  name: string;
  baseUrl: string;
  requestsPerWindow: number;
  windowInSeconds: number;
  appId: string;
  timeout?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: ApiApp[];
}

export function ApiAppsList() {
  const [apps, setApps] = useState<ApiApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        setError("Not authenticated, Try refreshing once.");
        return;
      }

      const response = await fetch("http://localhost:3002/api/apps", {
        headers: {
          // Authorization: `Bearer ${token}`,
          'x-api-key': apiKey,  
        },
      });

      const data = await response.json();
      setResponse(data);

      if (response.ok) {
        setApps(data);
      } else {
        setError(data.message || "Failed to fetch API apps");
      }
    } catch (err) {
      setError("Could not connect to server");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this API app?")) {
      return;
    }

    try {
      const apiKey = localStorage.getItem("apiKey");
      if (!apiKey) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:3002/api/apps/${appId}`, {
        method: "DELETE",
        headers: {
'x-api-key':apiKey
        },
      });

      if (response.ok) {
        toast("API app deleted", {
          description: "API app deleted successfully",
        });
        fetchApps(); // Refresh the list
      } else {
        const data = await response.json();
        toast("Error", {
          description: data.message || "Failed to delete API app",
          style: { backgroundColor: "red", color: "white" },
        });
      }
    } catch (err) {
      toast("Error", {
        description: "Could not connect to server",
        style: { backgroundColor: "red", color: "white" },
      });
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading API apps...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {apps.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              You don&apos;t have any API apps yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/apps/new">Create your first API app</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <CardTitle>{app.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Base URL:</span>{" "}
                      {app.baseUrl}
                    </div>
                    <div>
                      <span className="font-medium">Rate Limit:</span>{" "}
                      {app.requestsPerWindow} requests per {app.windowInSeconds}{" "}
                      seconds
                    </div>
                    {/* {app.timeout && (
                      <div>
                        <span className="font-medium">Timeout:</span>{" "}
                        {app.timeout}ms
                      </div>
                    )} */}
                    <div className="w-full">
                      <span className="font-medium">App Id: </span>
                      <span className="truncate w-full select-all">
                        {app.appId}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/apps/${app.appId}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/apps/${app.appId}/test`}>
                        <Play className="h-4 w-4 mr-2" />
                        Test
                      </Link>
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(app.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Raw Response:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
