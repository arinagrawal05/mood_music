import { NextResponse } from "next/server"
import type { ItunesTrack } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ message: "Search query is required" }, { status: 400 })
    }

    console.log(`Searching for: "${query}"`)

    // Use a more reliable iTunes API endpoint with proper headers
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15&media=music`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        next: { revalidate: 0 }, // Disable caching
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("iTunes search error response:", errorText)
      throw new Error(`iTunes API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`iTunes search returned ${data.resultCount} results`)

    // Format the response with error handling
    const tracks = data.results
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

    return NextResponse.json(tracks)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
