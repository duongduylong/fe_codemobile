import { TBook } from "src/models/book"
import { TChapter } from "src/models/chapter"

export type TReadBook = {
  bookId?: TBook,
  chapterId?: TChapter,
  status: "reading" | "finished",
  readAt: Date,
}
