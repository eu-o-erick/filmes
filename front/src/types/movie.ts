export interface MovieInfo {
  title: string;
  tagline?: string;
  overview?: string;
  release_date: string;
  genres: {
    name: string;
  }[];
  id: number;
  runtime: number;
}
