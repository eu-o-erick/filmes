import inquirer from "inquirer";
import { TMDBMovieResult } from "../interfaces/tmdb.interface";
import { TMDBService } from "./tmdb.service";
import { Logger } from "../utils/logger";

export class MovieService {
  private tmdbService: TMDBService;
  private logger: Logger;

  constructor() {
    this.tmdbService = new TMDBService();
    this.logger = new Logger();
  }

  public async processMovieList(movies: string[]): Promise<void> {
    for (const movieTitle of movies) {
      await this.processSingleMovie(movieTitle);
    }
  }

  private async processSingleMovie(movieTitle: string): Promise<void> {
    this.logger.info(`\nPesquisando: "${movieTitle}"`);

    const results = await this.tmdbService.searchMovie(movieTitle);

    if (results.length === 0) {
      this.logger.warn(`Nenhum resultado encontrado para: ${movieTitle}`);
      return;
    }

    const choices = results.map((movie, index) => ({
      name: this.formatMovieOption(movie, index + 1),
      value: index,
    }));

    choices.push({
      name: `${results.length + 1}. Nenhum dos acima`,
      value: choices.length,
    });

    const { selectedIndex } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedIndex",
        message: "Selecione a opção correta:",
        choices: choices,
        pageSize: Math.min(10, choices.length + 1),
        loop: false,
      },
    ]);

    if (selectedIndex >= 0 && selectedIndex < results.length) {
      const selectedMovie = results[selectedIndex];
      this.logger.success(
        `\n✅ Selecionado: ${selectedMovie.title} (${
          selectedMovie.release_date?.split("-")[0] || "Ano desconhecido"
        })`
      );
    } else {
      this.logger.warn("Nenhum filme selecionado para este arquivo.\n");
    }
  }

  private formatMovieOption(movie: TMDBMovieResult, index: number): string {
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
}
