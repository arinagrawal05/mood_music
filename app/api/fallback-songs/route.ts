import { NextResponse } from "next/server"
import type { Song } from "@/lib/types"

// Fallback data in case the iTunes API fails
const fallbackSongs: Song[] = [
  {
    id: "1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    albumArt: "/placeholder.svg?height=300&width=300&text=Shape+of+You",
    previewUrl: null,
    duration: 235000,
    album: "÷ (Divide)",
    itunesUrl: "#",
    releaseDate: "2017-01-06T00:00:00Z",
    genre: "Pop",
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    albumArt: "/placeholder.svg?height=300&width=300&text=Blinding+Lights",
    previewUrl: null,
    duration: 200000,
    album: "After Hours",
    itunesUrl: "#",
    releaseDate: "2019-11-29T00:00:00Z",
    genre: "Pop",
  },
  {
    id: "3",
    title: "Dance Monkey",
    artist: "Tones and I",
    albumArt: "/placeholder.svg?height=300&width=300&text=Dance+Monkey",
    previewUrl: null,
    duration: 210000,
    album: "The Kids Are Coming",
    itunesUrl: "#",
    releaseDate: "2019-05-10T00:00:00Z",
    genre: "Pop",
  },
  {
    id: "4",
    title: "Someone You Loved",
    artist: "Lewis Capaldi",
    albumArt: "/placeholder.svg?height=300&width=300&text=Someone+You+Loved",
    previewUrl: null,
    duration: 182000,
    album: "Divinely Uninspired to a Hellish Extent",
    itunesUrl: "#",
    releaseDate: "2018-11-08T00:00:00Z",
    genre: "Pop",
  },
  {
    id: "5",
    title: "Bad Guy",
    artist: "Billie Eilish",
    albumArt: "/placeholder.svg?height=300&width=300&text=Bad+Guy",
    previewUrl: null,
    duration: 194000,
    album: "When We All Fall Asleep, Where Do We Go?",
    itunesUrl: "#",
    releaseDate: "2019-03-29T00:00:00Z",
    genre: "Alternative",
  },
]

export async function GET() {
  return NextResponse.json(fallbackSongs)
}
