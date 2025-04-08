import { render, screen } from "@testing-library/react"
import { SongCard } from "@/components/song-card"
import { PlayerProvider } from "@/lib/player-context"

// Mock song data
const mockSong = {
  id: "123",
  title: "Test Song",
  artist: "Test Artist",
  albumArt: "/placeholder.svg?height=300&width=300",
  previewUrl: "https://example.com/test.mp3",
  duration: 180000,
  album: "Test Album",
  itunesUrl: "https://example.com",
  releaseDate: "2023-01-01",
  genre: "Pop",
}

// Mock the Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

describe("SongCard", () => {
  it("renders song information correctly", () => {
    render(
      <PlayerProvider>
        <SongCard song={mockSong} />
      </PlayerProvider>,
    )

    expect(screen.getByText("Test Song")).toBeInTheDocument()
    expect(screen.getByText("Test Artist")).toBeInTheDocument()
  })
})
