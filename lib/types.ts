export interface Song {
  id: string
  title: string
  artist: string
  albumArt: string
  previewUrl: string | null
  duration: number
  album?: string
  itunesUrl: string
  releaseDate?: string
  genre?: string
}

export interface GeminiSongSuggestion {
  title: string
  artist: string
}

export interface ItunesTrack {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string
  trackTimeMillis: number
  trackViewUrl: string
  releaseDate: string
  primaryGenreName: string
}
