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
