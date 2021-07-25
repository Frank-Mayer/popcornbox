export interface IPerson {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path?: string;
}

export enum Genre {
  Action = 28,
  Adventure = 12,
  Animation = 16,
  Comedy = 35,
  Crime = 80,
  Documentary = 99,
  Drama = 18,
  Family = 10751,
  Fantasy = 14,
  History = 36,
  Horror = 27,
  Music = 10402,
  Mystery = 9648,
  Romance = 10749,
  "Science Fiction" = 878,
  "TV Movie" = 10770,
  Thriller = 53,
  War = 10752,
  Western = 37,
  "Action & Adventure" = 10759,
  Kids = 10762,
  News = 10763,
  Reality = 10764,
  "Sci-Fi & Fantasy" = 10765,
  Soap = 10766,
  Talk = 10767,
  "War & Politics" = 10768,
}

export interface IMovieData {
  adult: boolean;
  backdrop_path: string | null;
  cast: Array<IPerson>;
  cover: string;
  date: string;
  fav: boolean;
  genres: Array<Genre>;
  id: number;
  info: string;
  mediaType: string;
  original: string;
  rating: number;
  status: number;
  title: string;
  typ: number;
  watchcount: number;
}
