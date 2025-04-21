import { render, screen, waitFor } from "@testing-library/react"
import { Dashboard } from "@/components/dashboard"
import { PlayerProvider } from "@/lib/player-context"
import { json } from "stream/consumers"

// Mock song data
const mockSongs = [
  {
    id: "1",
    title: "Lungi Dance",
    artist: "Yo Yo Honey Singh",
    albumArt: "/placeholder.svg?height=300&width=300&text=Lungi+Dance",
    previewUrl: "https://example.com/preview.mp3",
    duration: 235000,
    album: "Chennai Express",
    itunesUrl: "#",
    releaseDate: "2013-07-20T00:00:00Z",
    genre: "Bollywood",
  },
  {
    id: "2",
    title: "Swag- Se Swagat",
    artist: "Vishal Dadlani & Neha Bhasin",
    albumArt: "/placeholder.svg?height=300&width=300&text=Swag+Se+Swagat",
    previewUrl: "https://example.com/preview.mp3",
    duration: 200000,
    album: "Tiger Zinda Hai..",
    itunesUrl: "#",
    releaseDate: "2017-11-21T00:00:00Z",
    genre: "Bollywood",
  },
]

// Mock fetch system
const originalFetch = global.fetch
beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.toString().includes("/api/top-songs") || url.toString().includes("/api/fallback-songs")) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSongs)),
      })
    }
    if (url.toString().includes("/api/new-releases")) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockSongs)),
      })
    }
    return Promise.resolve({
      ok: false,
      text: () => Promise.resolve("Not found"),
    })
  })
})

afterEach(() => {
  global.fetch = originalFetch
})

describe("Dashboard", () => {
  it("renders dashboard with song sections", async () => {
    render(
      <PlayerProvider>
        <Dashboard />
      </PlayerProvider>,
    )

    // Wait for the async data to load
    await waitFor(() => {
      expect(screen.getByText("Top Bollywood Hits")).toBeInTheDocument()
    })
  })
})

