import type { Song } from "@/lib/types"
import { SongCard } from "@/components/song-card"

interface SongListProps {
  songs: Song[]
  variant?: "default" | "compact" | "row"
  title?: string
}

export function SongList({ songs, variant = "default", title }: SongListProps) {
  const songsWithPreview = songs.filter((song) => song.previewUrl)

  if (variant === "default") {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} variant="default" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "row") {
    return (
      <div className="space-y-2">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}
        <div className="space-y-1">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} variant="row" />
          ))}
        </div>
      </div>
    )
  }

  // Compact variant
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div className="grid gap-2">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} variant="compact" />
        ))}
      </div>
    </div>
  )
}
