"use client"

import Image from "next/image"
import type { Song } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, AlertCircle } from "lucide-react"
import { usePlayer } from "@/lib/player-context"
import { cn } from "@/lib/utils"

interface SongCardProps {
  song: Song
  variant?: "default" | "compact" | "row"
}
// we are using the variant prop to determine the layout of the card
export function SongCard({ song, variant = "default" }: SongCardProps) {
  const { playSong, pauseSong, currentSong, isPlaying } = usePlayer()

  const isCurrentSong = currentSong?.id === song.id

  const handlePlayClick = () => {
    if (isCurrentSong && isPlaying) {
      pauseSong()
    } else {
      playSong(song)
    }
  }

  // Format duration from milliseconds to mm:ss
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer" onClick={handlePlayClick}>
        <CardContent className="p-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <Image
                src={song.albumArt || "/placeholder.svg?height=48&width=48"}
                alt={song.title}
                width={48}
                height={48}
                className="object-cover rounded-md"
              />
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity",
                  isCurrentSong && isPlaying && "opacity-100",
                )}
              >
                {isCurrentSong && isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white ml-0.5" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-1">{song.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
            </div>
            <div className="text-xs text-muted-foreground">{formatDuration(song.duration)}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "row") {
    return (
      <div
        className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded-md transition-colors cursor-pointer"
        onClick={handlePlayClick}
      >
        <div className="relative flex-shrink-0">
          <Image
            src={song.albumArt || "/placeholder.svg?height=40&width=40"}
            alt={song.title}
            width={40}
            height={40}
            className="object-cover rounded-md"
          />
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity",
              isCurrentSong && isPlaying && "opacity-100",
            )}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white ml-0.5" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-1">{song.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{song.artist}</p>
        </div>
        <div className="text-xs text-muted-foreground">{formatDuration(song.duration)}</div>
      </div>
    )
  }

  // Default variant
  return (
    <Card className="overflow-hidden group cursor-pointer" onClick={handlePlayClick}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="relative aspect-square">
            <Image
              src={song.albumArt || "/placeholder.svg?height=200&width=200"}
              alt={song.title}
              fill
              className="object-cover"
            />
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity",
                isCurrentSong && isPlaying && "opacity-100",
              )}
            >
              {song.previewUrl ? (
                isCurrentSong && isPlaying ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white ml-1" />
                )
              ) : (
                <AlertCircle className="h-12 w-12 text-white/70" />
              )}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-1">{song.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{song.artist}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
