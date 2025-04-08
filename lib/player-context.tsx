"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect } from "react"
import type { Song } from "@/lib/types"

interface PlayerContextType {
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  volume: number
  playSong: (song: Song) => void
  pauseSong: () => void
  togglePlayPause: () => void
  setVolume: (volume: number) => void
  seekTo: (position: number) => void
  nextSong: () => void
  previousSong: () => void
  queue: Song[]
  addToQueue: (song: Song) => void
  clearQueue: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [queue, setQueue] = useState<Song[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    audio.volume = volume

    // Set up event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleSongEnd)
    audio.addEventListener("loadedmetadata", () => setIsAudioReady(true))
    audio.addEventListener("error", handleAudioError)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleSongEnd)
      audio.removeEventListener("loadedmetadata", () => setIsAudioReady(true))
      audio.removeEventListener("error", handleAudioError)

      // Properly clean up any pending play promises
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => audio.pause())
          .catch((err) => console.log("Ignoring play promise rejection during cleanup"))
      } else {
        audio.pause()
      }
    }
  }, [])

  const handleAudioError = (e: Event) => {
    console.error("Audio error:", e)
    setIsAudioReady(false)
    setIsPlaying(false)
  }

  // Update audio source when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong?.previewUrl) {
      // If there's a pending play promise, wait for it to resolve or reject before changing the source
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            setIsAudioReady(false)
            audioRef.current!.src = currentSong.previewUrl!
            playAudio()
          })
          .catch((err) => {
            // This is expected when rapidly switching songs
            console.log("Previous play promise was rejected, loading new song anyway")
            setIsAudioReady(false)
            audioRef.current!.src = currentSong.previewUrl!
            playAudio()
          })
      } else {
        setIsAudioReady(false)
        audioRef.current.src = currentSong.previewUrl
        playAudio()
      }
    }
  }, [currentSong])

  // Update audio playback state when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        playAudio()
      } else {
        // If there's a pending play promise, wait for it to resolve or reject before pausing
        if (playPromiseRef.current) {
          playPromiseRef.current
            .then(() => {
              audioRef.current!.pause()
            })
            .catch((err) => {
              // This is expected when rapidly switching songs
              console.log("Play promise rejected during pause, ignoring:", err)
            })
        } else {
          audioRef.current.pause()
        }
      }
    }
  }, [isPlaying])

  // Safe play function that handles the play promise
  const playAudio = () => {
    if (audioRef.current) {
      try {
        // Store the play promise so we can handle it properly
        const promise = audioRef.current.play()
        if (promise !== undefined) {
          playPromiseRef.current = promise
          promise
            .then(() => {
              // Play started successfully
              playPromiseRef.current = null
            })
            .catch((err) => {
              // Play was interrupted or failed
              console.log("Play interrupted:", err.message)
              playPromiseRef.current = null

              // Only update isPlaying if this wasn't due to a new load request
              // This prevents UI flicker when rapidly changing songs
              if (err.message !== "The play() request was interrupted by a new load request.") {
                setIsPlaying(false)
              }
            })
        }
      } catch (err) {
        console.error("Error playing audio:", err)
        setIsPlaying(false)
      }
    }
  }

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration
      if (duration && !isNaN(duration) && isFinite(duration)) {
        const currentProgress = (audioRef.current.currentTime / duration) * 100
        setProgress(isNaN(currentProgress) ? 0 : currentProgress)
      }
    }
  }

  const handleSongEnd = () => {
    if (queue.length > 0) {
      // Play next song in queue
      const nextSong = queue[0]
      const newQueue = queue.slice(1)
      setQueue(newQueue)
      setCurrentSong(nextSong)
      setIsPlaying(true)
    } else {
      // No more songs in queue
      setProgress(0)
      setIsPlaying(false)
    }
  }

  const playSong = (song: Song) => {
    // If the song is already playing, just resume
    if (currentSong?.id === song.id) {
      setIsPlaying(true)
      return
    }

    // Otherwise, set the new song
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)
  }

  const pauseSong = () => {
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying)
    }
  }

  const seekTo = (position: number) => {
    if (audioRef.current && currentSong && isAudioReady) {
      const duration = audioRef.current.duration

      // Check if duration is valid and position is within range
      if (
        duration &&
        !isNaN(duration) &&
        isFinite(duration) &&
        position >= 0 &&
        position <= 100 &&
        isFinite(position)
      ) {
        const newTime = (position / 100) * duration

        // Additional check to ensure newTime is valid
        if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0 && newTime <= duration) {
          audioRef.current.currentTime = newTime
          setProgress(position)
        }
      }
    }
  }

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0]
      const newQueue = queue.slice(1)
      setQueue(newQueue)
      setCurrentSong(nextSong)
      setIsPlaying(true)
    }
  }

  const previousSong = () => {
    // For simplicity, just restart the current song
    if (audioRef.current && isAudioReady) {
      audioRef.current.currentTime = 0
      setProgress(0)
    }
  }

  const addToQueue = (song: Song) => {
    setQueue([...queue, song])
  }

  const clearQueue = () => {
    setQueue([])
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        volume,
        playSong,
        pauseSong,
        togglePlayPause,
        setVolume,
        seekTo,
        nextSong,
        previousSong,
        queue,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
