"use client"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { SongList } from "@/components/song-list"
import { Loader2, Search } from "lucide-react"
import type { Song } from "@/lib/types"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 550) // 550ms delay

    return () => clearTimeout(timer)
  }, [query])

  // Perform search when debounced query changes
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSongs([])
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Searching for:", searchQuery)

      // Use a try-catch block to handle fetch errors
      const response = await fetch(`/api/search-music?q=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      })

      console.log("Search response status:", response.status)

      if (!response.ok) {
        let errorMessage = `Failed to search songs: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMessage = `Server error: ${response.statusText || response.status}`
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please try again later.Thanks")
      }

      const data = await response.json()
      console.log(`Received ${data.length} songs from search`)
      setSongs(data)
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong with the search")
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery, performSearch])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Search Music</h2>
        <p className="text-muted-foreground">Find your favorite songs, artists, and albums</p>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search for songs, artists, or albums"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      {songs.length > 0 && (
        <div>
          <SongList songs={songs} variant="compact" />
        </div>
      )}

      {query && !loading && songs.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
