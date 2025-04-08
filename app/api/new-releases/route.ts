import { NextResponse } from "next/server"
import type { ItunesTrack } from "@/lib/types"

export async function GET() {
  try {
    // Use a more reliable approach with a popular artist to get recent music
    // This is more likely to return results than a generic "new" search
    const response = await fetch("https://itunes.apple.com/search?term=popular&entity=song&limit=10&sort=recent")

    if (!response.ok) {
      console.error(`iTunes API returned status: ${response.status}`)
      const errorText = await response.text()
      console.error(`iTunes API error response: ${errorText}`)
      throw new Error(`iTunes API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`iTunes API returned ${data.resultCount} results`)

    // Check if we have results
    if (!data.results || data.results.length === 0) {
      console.log("No results returned from iTunes API")
      return NextResponse.json([]) // Return empty array instead of error
    }

    // Map the results to our Song format with error handling for each track
    const songs = data.results
      .filter((track: any) => {
        // Filter out any tracks that don't have required fields
        return track && track.trackId && track.trackName && track.artistName && track.artworkUrl100
      })
      .map((track: ItunesTrack) => ({
        id: track.trackId.toString(),
        title: track.trackName || "Unknown Title",
        artist: track.artistName || "Unknown Artist",
        albumArt: (track.artworkUrl100 || "/placeholder.svg?height=300&width=300").replace("100x100", "300x300"),
        previewUrl: track.previewUrl || null,
        duration: track.trackTimeMillis || 30000, // Default to 30 seconds if missing
        album: track.collectionName || "Unknown Album",
        itunesUrl: track.trackViewUrl || "#",
        releaseDate: track.releaseDate || new Date().toISOString(),
        genre: track.primaryGenreName || "Music",
      }))

    return NextResponse.json(songs)
  } catch (error) {
    console.error("New releases API error:", error)
    // Return a more detailed error message
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : "No stack trace available",
      },
      { status: 500 },
    )
  }
}
