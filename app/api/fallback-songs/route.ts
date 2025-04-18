import { NextResponse } from "next/server"
import type { Song } from "@/lib/types"

// Fallback data with the requested Bollywood songs
const fallbackSongs: Song[] = [
  {
    id: "1",
    title: "Lungi Dance",
    artist: "Yo Yo Honey Singh",
    albumArt: "/placeholder.svg?height=300&width=300&text=Lungi+Dance",
    previewUrl: null,
    duration: 235000,
    album: "Chennai Express",
    itunesUrl: "#",
    releaseDate: "2013-07-20T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "2",
    title: "Swag Se Swagat",
    artist: "Vishal Dadlani & Neha Bhasin",
    albumArt: "/placeholder.svg?height=300&width=300&text=Swag+Se+Swagat",
    previewUrl: null,
    duration: 200000,
    album: "Tiger Zinda Hai",
    itunesUrl: "#",
    releaseDate: "2017-11-21T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "3",
    title: "Badtameez Dil",
    artist: "Benny Dayal",
    albumArt: "/placeholder.svg?height=300&width=300&text=Badtameez+Dil",
    previewUrl: null,
    duration: 210000,
    album: "Yeh Jawaani Hai Deewani",
    itunesUrl: "#",
    releaseDate: "2013-03-20T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "4",
    title: "Tune Maari Entriyaan",
    artist: "Vishal Dadlani, Bappi Lahiri & KK",
    albumArt: "/placeholder.svg?height=300&width=300&text=Tune+Maari+Entriyaan",
    previewUrl: null,
    duration: 182000,
    album: "Gunday",
    itunesUrl: "#",
    releaseDate: "2014-01-07T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "5",
    title: "Gallan Goodiyan",
    artist: "Shankar Mahadevan, Yashita Sharma & Manish Kumar Tipu",
    albumArt: "/placeholder.svg?height=300&width=300&text=Gallan+Goodiyan",
    previewUrl: null,
    duration: 194000,
    album: "Dil Dhadakne Do",
    itunesUrl: "#",
    releaseDate: "2015-05-12T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "6",
    title: "The Breakup Song",
    artist: "Arijit Singh, Badshah, Jonita Gandhi & Nakash Aziz",
    albumArt: "/placeholder.svg?height=300&width=300&text=The+Breakup+Song",
    previewUrl: null,
    duration: 235000,
    album: "Ae Dil Hai Mushkil",
    itunesUrl: "#",
    releaseDate: "2016-10-13T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "7",
    title: "Tareefan",
    artist: "Badshah & QARAN",
    albumArt: "/placeholder.svg?height=300&width=300&text=Tareefan",
    previewUrl: null,
    duration: 200000,
    album: "Veere Di Wedding",
    itunesUrl: "#",
    releaseDate: "2018-05-02T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "8",
    title: "London Thumakda",
    artist: "Labh Janjua, Sonu Kakkar & Neha Kakkar",
    albumArt: "/placeholder.svg?height=300&width=300&text=London+Thumakda",
    previewUrl: null,
    duration: 210000,
    album: "Queen",
    itunesUrl: "#",
    releaseDate: "2014-02-07T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "9",
    title: "Cutiepie",
    artist: "Pardeep Singh Sran & Nakash Aziz",
    albumArt: "/placeholder.svg?height=300&width=300&text=Cutiepie",
    previewUrl: null,
    duration: 182000,
    album: "Ae Dil Hai Mushkil",
    itunesUrl: "#",
    releaseDate: "2016-10-28T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "10",
    title: "Saturday Saturday",
    artist: "Badshah & Indeep Bakshi",
    albumArt: "/placeholder.svg?height=300&width=300&text=Saturday+Saturday",
    previewUrl: null,
    duration: 194000,
    album: "Humpty Sharma Ki Dulhania",
    itunesUrl: "#",
    releaseDate: "2014-06-14T00:00:00Z",
    genre: "Bollywood",
  },
]

export async function GET() {
  return NextResponse.json(fallbackSongs)
}
