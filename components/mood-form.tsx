"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SongList } from "@/components/song-list"
import { Loader2 } from "lucide-react"
import type { Song } from "@/lib/types"

export function MoodForm() {
  const [mood, setMood] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim()) return

    setLoading(true)
    setError("")
    setSongs([])

    try {
      console.log("Getting songs for mood:", mood)
      const response = await fetch("/api/get-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      })
      console.log("Mood response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Mood error response:", errorData)
        throw new Error(errorData.message || `Failed to get song recommendations: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received ${data.length} songs for mood`)
      setSongs(data)
    } catch (err) {
      console.error("Mood error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a mood or vibe (e.g., energetic, melancholic, chill)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? "Finding songs..." : "Get Songs"}
        </Button>
      </form>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-md">{error}</div>}

      {songs.length > 0 && <SongList songs={songs} />}
    </div>
  )
}
