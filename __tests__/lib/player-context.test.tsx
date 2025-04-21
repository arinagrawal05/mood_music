"use client"

import { render } from "@testing-library/react"
import { PlayerProvider, usePlayer } from "@/lib/player-context"
import { describe, it, expect, jest } from "@jest/globals"

// Mock song data
const mockSong = {
  id: "132",
  title: "Test Song",
  artist: "Test Artist",
  albumArt: "/placeholder.svg",
  previewUrl: "https://example1.com/test.mp3",
  duration: 18000,
  album: "Test-Album",
  itunesUrl: "https://example1.com",
  releaseDate: "2004-11-06",
  genre: "Country Music",
}

// Mock HTMLMediaElement
window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve())
window.HTMLMediaElement.prototype.pause = jest.fn()

// Test component that uses the player context
function TestComponent() {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer()

  return (
    <div>
      <div data-testid="current-song">{currentSong?.title || "No song"}</div>
      <div data-testid="is-playing">{isPlaying ? "Playing" : "Paused"}</div>
      <button onClick={() => playSong(mockSong)}>Play</button>
      <button onClick={pauseSong}>Pause</button>
    </div>
  )
}

describe("PlayerContext", () => {
  it("provides player context to children", () => {
    const { getByTestId } = render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>,
    )

    expect(getByTestId("current-song").textContent).toBe("No song")
    expect(getByTestId("is-playing").textContent).toBe("Paused")
  })
})
