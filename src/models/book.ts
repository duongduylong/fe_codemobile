import { TAuthor } from 'src/models/author'

export type TBook = {
  title: string
  author: TAuthor
  genres: string[]
  description: string
  coverImage: string
  totalChapters: number
  rating: number
  views: number
  viewStats: {
    day: number
    week: number
    month: number
  }
  reviewStats: {
    day: number
    week: number
    month: number
  }
  lastStatsUpdate: {
    day: number
    week: number
    month: number
  }
}
