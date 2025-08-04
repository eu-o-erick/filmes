import { TMDBMovieResult } from "../interfaces/tmdb.interface";

export class TMDBHelper {
  private readonly baseImageUrl = "https://image.tmdb.org/t/p/original";

  public formatMovieOption(movie: TMDBMovieResult, index: number): string {
    const year = movie.release_date
      ? movie.release_date.split("-")[0]
      : "Ano desconhecido";
    const overview = movie.overview
      ? movie.overview.substring(0, 120) +
        (movie.overview.length > 120 ? "..." : "")
      : "Sem descrição disponível";

    return [
      `${index}. ${movie.title} (${year})`,
      `   ${overview}`,
      movie.original_title && movie.original_title !== movie.title
        ? `   Título original: ${movie.original_title}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  public getImageUrl(imagePath: string): string {
    return `${this.baseImageUrl}${imagePath}`;
  }
}
