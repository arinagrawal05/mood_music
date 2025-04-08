import { NextResponse } from "next/server"
import type { ItunesTrack } from "@/lib/types"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Define the specific songs we want to search for
    const songQueries = [
      "Lungi Dance",
      "Swag Se Swagat",
      "Badtameez Dil",
      "Tune Maari Entriyaan",
      "Gallan Goodiyan",
      "The Breakup Song",
      "Tareefan",
      "London Thumakda",
      "Cutiepie",
      "Saturday Saturday",
      "Desi Girl",
      "Kar Gayi Chull",
    ]

    // We'll collect all results here
    let allResults: any[] = []

    // Try to find each song
    for (const query of songQueries) {
      if (allResults.length >= 10) break

      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query + " bollywood")}&entity=song&limit=1&country=in`,
          {
            headers: {
              Accept: "*/*", // Accept any content type
            },
            next: { revalidate: 0 }, // Disable caching
          },
        )

        if (!response.ok) {
          console.error(`iTunes API returned status: ${response.status} for "${query}"`)
          continue
        }

        // Get the response text first
        const responseText = await response.text()

        // Try to parse the text as JSON regardless of content type
        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error(`Failed to parse response for "${query}": ${parseError}`)
          continue
        }

        if (data.results && data.results.length > 0) {
          // Add new results, avoiding duplicates by trackId
          const existingIds = new Set(allResults.map((track: any) => track.trackId))
          const newResults = data.results.filter(
            (track: any) =>
              !existingIds.has(track.trackId) &&
              track &&
              track.trackId &&
              track.trackName &&
              track.artistName &&
              track.artworkUrl100,
          )

          allResults = [...allResults, ...newResults]
        }
      } catch (err) {
        console.error(`Error fetching results for "${query}":`, err)
      }
    }

    // If we don't have enough results from the API, use the fallback data
    if (allResults.length < 10) {
      // Fetch from our fallback API
      try {
        const fallbackResponse = await fetch(new URL("/api/fallback-songs", request.url).toString())

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()

          // Add fallback songs to fill up to 10 songs
          const existingIds = new Set(allResults.map((track: any) => track.trackId?.toString()))
          let i = 0
          while (allResults.length < 10 && i < fallbackData.length) {
            if (!existingIds.has(fallbackData[i].id)) {
              // Convert fallback song to match iTunes format for processing
              allResults.push({
                trackId: fallbackData[i].id,
                trackName: fallbackData[i].title,
                artistName: fallbackData[i].artist,
                artworkUrl100: fallbackData[i].albumArt,
                previewUrl: fallbackData[i].previewUrl,
                trackTimeMillis: fallbackData[i].duration,
                collectionName: fallbackData[i].album,
                trackViewUrl: fallbackData[i].itunesUrl,
                releaseDate: fallbackData[i].releaseDate,
                primaryGenreName: fallbackData[i].genre,
              })
            }
            i++
          }
        }
      } catch (err) {
        console.error("Error fetching fallback songs:", err)
      }
    }

    // Map the results to our Song format
    const songs = allResults
      .slice(0, 10) // Take exactly 10 songs
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

    // If we still don't have 10 songs, use all fallback songs
    if (songs.length < 10) {
      return fetch(new URL("/api/fallback-songs", request.url).toString())
    }

    return NextResponse.json(songs)
  } catch (error) {
    console.error("Top songs API error:", error)

    // On any error, use the fallback songs
    return fetch(new URL("/api/fallback-songs", request.url).toString())
  }
}
