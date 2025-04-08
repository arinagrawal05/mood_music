import { render, screen } from "@testing-library/react"
import { Dashboard } from "@/components/dashboard"
import { PlayerProvider } from "@/lib/player-context"

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => [
    {
      id: "123",
      title: "Test Bollywood Song",
      artist: "Test Artist",
      albumArt: "/placeholder.svg",
      previewUrl: "https://example.com/test.mp3",
      duration: 180000,
      genre: "Bollywood",
    },
  ],
})

describe("Dashboard", () => {
  it("renders dashboard with song sections", async () => {
    render(
      <PlayerProvider>
        <Dashboard />
      </PlayerProvider>,
    )

    // Wait for the async data to load
    expect(await screen.findByText("Top Bollywood Hits")).toBeInTheDocument()
  })
})
