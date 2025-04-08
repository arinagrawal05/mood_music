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
  const [isBollywood, setIsBollywood] = useState(false)

  const fetchDashboardData = async (useFallback = false) => {
    try {
      setError(null)
      setLoading(true)
      setIsBollywood(false)

      // Fetch top songs
      let topData: Song[] = []
      try {
        const topEndpoint = useFallback ? "/api/fallback-songs" : "/api/top-songs"
        const topResponse = await fetch(topEndpoint)
        if (!topResponse.ok && !useFallback) {
          console.warn(`Failed to fetch top songs: ${topResponse.status}, using fallback`)
          const fallbackResponse = await fetch("/api/fallback-songs")
          topData = await fallbackResponse.json()
          setUsingFallback(true)
        } else {
          topData = await topResponse.json()

          // Check if these are Bollywood songs by looking at genre or artist names
          const isBollywoodMusic = topData.some(
            (song) =>
              song.genre?.toLowerCase().includes("bollywood") ||
              song.genre?.toLowerCase().includes("indian") ||
              song.artist.toLowerCase().includes("kumar") ||
              song.artist.toLowerCase().includes("khan") ||
              song.artist.toLowerCase().includes("singh") ||
              song.artist.toLowerCase().includes("kapoor"),
          )

          setIsBollywood(isBollywoodMusic)
        }
      } catch (err) {
        console.error("Error fetching top songs:", err)
        if (!useFallback) {
          const fallbackResponse = await fetch("/api/fallback-songs")
          topData = await fallbackResponse.json()
          setUsingFallback(true)
        }
      }
      setTopSongs(topData)

      // Fetch new releases
      let newData: Song[] = []
      try {
        const newEndpoint = useFallback ? "/api/fallback-songs" : "/api/new-releases"
        const newResponse = await fetch(newEndpoint)
        if (!newResponse.ok && !useFallback) {
          console.warn(`Failed to fetch new releases: ${newResponse.status}, using fallback`)
          const fallbackResponse = await fetch("/api/fallback-songs")
          newData = await fallbackResponse.json()
          setUsingFallback(true)
        } else {
          newData = await newResponse.json()
        }
      } catch (err) {
        console.error("Error fetching new releases:", err)
        if (!useFallback) {
          const fallbackResponse = await fetch("/api/fallback-songs")
          newData = await fallbackResponse.json()
          setUsingFallback(true)
        }
      }
      setNewReleases(newData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard data")
      setUsingFallback(true)
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

      {topSongs.length > 0 && (
        <SongList songs={topSongs} title={isBollywood ? "Top Bollywood Hits" : "Top Songs"} variant="default" />
      )}

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
