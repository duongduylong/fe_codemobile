import { TReadBook } from "src/models/readBook";

export type TUser = {
  username: string,
  email: string,
  favoriteGenres: string[],
  readHistory: TReadBook[],
}
