import { TBook } from "src/models/book"

export type TChapter = {
  bookId: TBook,
  chapterNumber: number
  title: string
  content: string
}
