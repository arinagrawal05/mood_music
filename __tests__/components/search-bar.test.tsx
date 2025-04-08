import { render, screen } from "@testing-library/react"
import { SearchBar } from "@/components/search-bar"
import { PlayerProvider } from "@/lib/player-context"

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => [],
})

describe("SearchBar", () => {
  it("renders search input correctly", () => {
    render(
      <PlayerProvider>
        <SearchBar />
      </PlayerProvider>,
    )

    expect(screen.getByPlaceholderText("Search for songs, artists, or albums")).toBeInTheDocument()
  })
})
