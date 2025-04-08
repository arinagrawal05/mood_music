import { NextResponse } from "next/server"
import type { GeminiSongSuggestion, ItunesTrack } from "@/lib/types"

// Gemini API for song suggestions
async function getSongSuggestions(mood: string): Promise<GeminiSongSuggestion[]> {
  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const prompt = `
    You are a music expert. Based on the mood or vibe "${mood}", suggest 8 songs that match this mood.
    Return ONLY a JSON array with objects containing "title" and "artist" properties.
    Example: [{"title": "Song Name", "artist": "Artist Name"}, ...]
    Do not include any explanations or other text, just the JSON array.
  `

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error response:", errorText)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Gemini API response:", JSON.stringify(data, null, 2))

    const text = data.candidates[0].content.parts[0].text

    // Extract JSON from the response
    const jsonMatch = text.match(/\[.*\]/s)
    if (!jsonMatch) {
      console.error("Failed to parse JSON from Gemini response:", text)
      throw new Error("Failed to parse song suggestions from Gemini")
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error("Error getting song suggestions:", error)
    throw error
  }
}

// Search for a song on iTunes
async function searchItunesSong(title: string, artist: string) {
  try {
    const query = encodeURIComponent(`${title} ${artist}`)
    const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=1&media=music`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("iTunes search error response:", errorText)
      throw new Error(`iTunes search error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const track = data.results[0] as ItunesTrack
      return {
        id: track.trackId.toString(),
        title: track.trackName,
        artist: track.artistName,
        albumArt: track.artworkUrl100.replace("100x100", "300x300"), // Get larger artwork
        previewUrl: track.previewUrl,
        duration: track.trackTimeMillis,
        album: track.collectionName,
        itunesUrl: track.trackViewUrl,
        releaseDate: track.releaseDate,
        genre: track.primaryGenreName,
      }
    }

    return null
  } catch (error) {
    console.error("Error searching iTunes song:", error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { mood } = await request.json()

    if (!mood) {
      return NextResponse.json({ message: "Mood is required" }, { status: 400 })
    }

    // Get song suggestions from Gemini
    const songSuggestions = await getSongSuggestions(mood)
    console.log("Song suggestions from Gemini:", songSuggestions)

    // Search for each song on iTunes
    const songPromises = songSuggestions.map(async (song) => {
      return await searchItunesSong(song.title, song.artist)
    })

    const allSongs = (await Promise.all(songPromises)).filter(Boolean)
    console.log("All songs from iTunes:", allSongs)

    // Return all songs
    return NextResponse.json(allSongs)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
