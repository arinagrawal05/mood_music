"use client"

import { usePlayer } from "@/lib/player-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function GlobalPlayer() {
  const { currentSong, isPlaying, progress, volume, togglePlayPause, setVolume, seekTo, nextSong, previousSong } =
    usePlayer()
  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(volume)
  const [localProgress, setLocalProgress] = useState(progress)

  // Update local progress when the global progress changes
  useEffect(() => {
    setLocalProgress(progress)
  }, [progress])

  // Format time from seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate current time and duration
  const calculateTime = () => {
    if (!currentSong) return { currentTime: "0:00", duration: "0:00" }

    const durationInSeconds = currentSong.duration / 1000
    const currentTimeInSeconds = (localProgress / 100) * durationInSeconds

    return {
      currentTime: formatTime(currentTimeInSeconds),
      duration: formatTime(durationInSeconds),
    }
  }

  const { currentTime, duration } = calculateTime()

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
    }
    setIsMuted(!isMuted)
  }

  const handleSliderChange = (value: number[]) => {
    if (value.length > 0) {
      const newPosition = value[0]
      // Update local state immediately for a responsive UI
      setLocalProgress(newPosition)
      // Debounce the actual seek operation to avoid rapid updates
      const timeoutId = setTimeout(() => {
        seekTo(newPosition)
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }

  if (!currentSong) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Song info */}
        <div className="flex items-center w-1/4">
          <div className="relative h-12 w-12 mr-3">
            <Image
              src={currentSong.albumArt || "/placeholder.svg?height=48&width=48"}
              alt={currentSong.title}
              width={48}
              height={48}
              className="rounded-md object-cover"
            />
          </div>
          <div className="truncate">
            <p className="font-medium text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="icon" onClick={previousSong} className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={togglePlayPause} className="h-9 w-9 rounded-full">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextSong} className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center w-full gap-2">
            <span className="text-xs text-muted-foreground w-10 text-right">{currentTime}</span>
            <Slider
              value={[localProgress]}
              max={100}
              step={0.1}
              onValueChange={handleSliderChange}
              className="flex-1 h-1"
            />
            <span className="text-xs text-muted-foreground w-10">{duration}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center justify-end w-1/4 gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => {
              if (value.length > 0) {
                const newVolume = value[0] / 100
                setVolume(newVolume)
                if (newVolume > 0) setIsMuted(false)
                else setIsMuted(true)
              }
            }}
            className="w-24 h-1"
          />
        </div>
      </div>
    </div>
  )
}
