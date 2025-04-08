import { NextResponse } from "next/server"
import type { ItunesTrack } from "@/lib/types"

export async function GET() {
  try {
    // Search for top Bollywood songs - increased limit to get more results
    const response = await fetch("https://itunes.apple.com/search?term=bollywood&entity=song&limit=20&country=in", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Disable caching
    })

    if (!response.ok) {
      console.error(`iTunes API returned status: ${response.status}`)
      const errorText = await response.text()
      console.error(`iTunes API error response: ${errorText}`)
      throw new Error(`iTunes API error: ${response.status}`)
    }

    const data = await response.json()
    console.log(`iTunes API returned ${data.resultCount} Bollywood results`)

    // Check if we have enough results
    if (!data.results || data.results.length < 10) {
      console.log("Not enough Bollywood results, trying with different search terms")

      // Try with a different search term for Bollywood
      const alternativeResponse = await fetch(
        "https://itunes.apple.com/search?term=hindi+songs&entity=song&limit=20&country=in",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          next: { revalidate: 0 }, // Disable caching
        },
      )

      if (!alternativeResponse.ok) {
        throw new Error(`Alternative API error: ${alternativeResponse.status}`)
      }

      const alternativeData = await alternativeResponse.json()

      if (!alternativeData.results || alternativeData.results.length < 10) {
        // Fallback to general popular songs
        const fallbackResponse = await fetch("https://itunes.apple.com/search?term=popular&entity=song&limit=10", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          next: { revalidate: 0 }, // Disable caching
        })

        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API error: ${fallbackResponse.status}`)
        }

        const fallbackData = await fallbackResponse.json()

        if (!fallbackData.results || fallbackData.results.length === 0) {
          return NextResponse.json([]) // Return empty array if no results
        }

        // Map the fallback results
        const fallbackSongs = fallbackData.results
          .filter((track: any) => {
            return track && track.trackId && track.trackName && track.artistName && track.artworkUrl100
          })
          .slice(0, 10) // Limit to exactly 10 songs
          .map((track: ItunesTrack) => ({
            id: track.trackId.toString(),
            title: track.trackName || "Unknown Title",
            artist: track.artistName || "Unknown Artist",
            albumArt: (track.artworkUrl100 || "/placeholder.svg?height=300&width=300").replace("100x100", "300x300"),
            previewUrl: track.previewUrl || null,
            duration: track.trackTimeMillis || 30000,
            album: track.collectionName || "Unknown Album",
            itunesUrl: track.trackViewUrl || "#",
            releaseDate: track.releaseDate || new Date().toISOString(),
            genre: track.primaryGenreName || "Music",
          }))

        return NextResponse.json(fallbackSongs)
      }

      // Map the alternative results
      const alternativeSongs = alternativeData.results
        .filter((track: any) => {
          return track && track.trackId && track.trackName && track.artistName && track.artworkUrl100
        })
        .slice(0, 10) // Limit to exactly 10 songs
        .map((track: ItunesTrack) => ({
          id: track.trackId.toString(),
          title: track.trackName || "Unknown Title",
          artist: track.artistName || "Unknown Artist",
          albumArt: (track.artworkUrl100 || "/placeholder.svg?height=300&width=300").replace("100x100", "300x300"),
          previewUrl: track.previewUrl || null,
          duration: track.trackTimeMillis || 30000,
          album: track.collectionName || "Unknown Album",
          itunesUrl: track.trackViewUrl || "#",
          releaseDate: track.releaseDate || new Date().toISOString(),
          genre: track.primaryGenreName || "Music",
        }))

      return NextResponse.json(alternativeSongs)
    }

    // Map the results to our Song format with error handling for each track
    const songs = data.results
      .filter((track: any) => {
        // Filter out any tracks that don't have required fields
        return track && track.trackId && track.trackName && track.artistName && track.artworkUrl100
      })
      .slice(0, 10) // Limit to exactly 10 songs
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
    console.error("Top songs API error:", error)
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
