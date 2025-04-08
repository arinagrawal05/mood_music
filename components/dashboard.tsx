"use client"

import { useEffect, useState } from "react"
import { SongList } from "@/components/song-list"
import type { Song } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const [topSongs, setTopSongs] = useState<Song[]>([])
  const [newReleases, setNewReleases] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchDashboardData = async (useFallback = false) => {
    try {
      setError(null)
      setLoading(true)

      // Fetch top Bollywood songs
      let topData: Song[] = []
      try {
        const topEndpoint = useFallback ? "/api/fallback-songs" : "/api/top-songs"
        const topResponse = await fetch(topEndpoint, {
          cache: "no-store",
        })

        if (!topResponse.ok && !useFallback) {
          console.warn(`Failed to fetch top songs: ${topResponse.status}, using fallback`)
          const fallbackResponse = await fetch("/api/fallback-songs")

          // Get the response text first and try to parse it
          const responseText = await fallbackResponse.text()
          try {
            topData = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Failed to parse fallback response:", parseError)
            throw new Error("Failed to parse fallback response")
          }

          setUsingFallback(true)
        } else {
          // Get the response text first and try to parse it
          const responseText = await topResponse.text()
          try {
            topData = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Failed to parse top songs response:", parseError)
            throw new Error("Failed to parse top songs response")
          }
        }
      } catch (err) {
        console.error("Error fetching top songs:", err)
        if (!useFallback) {
          try {
            const fallbackResponse = await fetch("/api/fallback-songs")
            const responseText = await fallbackResponse.text()
            topData = JSON.parse(responseText)
            setUsingFallback(true)
          } catch (fallbackError) {
            console.error("Error parsing fallback data:", fallbackError)
            // For tests, provide default data if all else fails
            topData = []
          }
        }
      }
      setTopSongs(topData)

      // Fetch new releases
      let newData: Song[] = []
      try {
        const newEndpoint = useFallback ? "/api/fallback-songs" : "/api/new-releases"
        const newResponse = await fetch(newEndpoint, {
          cache: "no-store",
        })

        if (!newResponse.ok && !useFallback) {
          console.warn(`Failed to fetch new releases: ${newResponse.status}, using fallback`)
          const fallbackResponse = await fetch("/api/fallback-songs")
          const responseText = await fallbackResponse.text()
          try {
            newData = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Failed to parse fallback response:", parseError)
            throw new Error("Failed to parse fallback response")
          }
          setUsingFallback(true)
        } else {
          const responseText = await newResponse.text()
          try {
            newData = JSON.parse(responseText)
          } catch (parseError) {
            console.error("Failed to parse new releases response:", parseError)
            throw new Error("Failed to parse new releases response")
          }
        }
      } catch (err) {
        console.error("Error fetching new releases:", err)
        if (!useFallback) {
          try {
            const fallbackResponse = await fetch("/api/fallback-songs")
            const responseText = await fallbackResponse.text()
            newData = JSON.parse(responseText)
            setUsingFallback(true)
          } catch (fallbackError) {
            console.error("Error parsing fallback data:", fallbackError)
          }
        }
      }
      setNewReleases(newData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")

      // Always try to load fallback data on error
      try {
        const fallbackResponse = await fetch("/api/fallback-songs")
        const fallbackData = await fallbackResponse.json()
        setTopSongs(fallbackData)
        setNewReleases(fallbackData)
        setUsingFallback(true)
      } catch (fallbackError) {
        console.error("Error fetching fallback data:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    fetchDashboardData(false) // Try using the real API again
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {usingFallback && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using demo content</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>We're currently showing demo content because we couldn't connect to the music service.</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
              <RefreshCcw className="h-3 w-3 mr-1" /> Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-2">
              <RefreshCcw className="h-3 w-3 mr-1" /> Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {topSongs.length > 0 && <SongList songs={topSongs} title="Top Bollywood Hits" variant="default" />}

      {newReleases.length > 0 && <SongList songs={newReleases} title="New Releases" variant="default" />}

      {topSongs.length === 0 && newReleases.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No songs available</h3>
          <p className="text-muted-foreground mt-2">Try searching for songs or using the mood suggestions</p>
          <Button variant="outline" onClick={handleRefresh} className="mt-4">
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      )}
    </div>
  )
}
