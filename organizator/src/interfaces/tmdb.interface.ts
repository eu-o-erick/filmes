export interface TMDBMovieResult {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path?: string | null;
  original_title?: string;
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovieResult[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  tagline: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: {
    id: number;
    name: string;
  }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  budget: number;
  revenue: number;
  status: string;
  homepage: string | null;
  imdb_id: string | null;
  adult: boolean;
  video: boolean;
}
