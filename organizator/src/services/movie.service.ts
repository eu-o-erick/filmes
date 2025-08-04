import inquirer from "inquirer";
import { TMDBMovieResult } from "../interfaces/tmdb.interface";
import { TMDBService } from "./tmdb.service";
import { Logger } from "../utils/logger";
import { FileHandler } from "../utils/file-handler";
import { TMDBHelper } from "../utils/tmdb-helper";
import { ImageDownloaderService } from "./image-downloader.service";
import * as path from "path";

export class MovieService {
  private tmdbService: TMDBService;
  private logger: Logger;
  private fileHandler: FileHandler;
  private tmdbHelper: TMDBHelper;
  private imageDownloader: ImageDownloaderService;
  private moviesDir: string;

  constructor() {
    this.logger = new Logger();
    this.tmdbService = new TMDBService();
    this.fileHandler = new FileHandler(this.logger);
    this.tmdbHelper = new TMDBHelper();
    this.imageDownloader = new ImageDownloaderService(
      this.logger,
      this.fileHandler
    );
    this.moviesDir = process.argv[2];
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

    const selectedMovie = await this.promptMovieSelection(results);
    if (!selectedMovie) return;

    const dirPath = path.join(this.moviesDir, selectedMovie.title);
    await this.processMovieDownload(selectedMovie, dirPath);
  }

  private async promptMovieSelection(
    results: TMDBMovieResult[]
  ): Promise<TMDBMovieResult | null> {
    const choices = results.map((movie, index) => ({
      name: this.tmdbHelper.formatMovieOption(movie, index + 1),
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
        choices,
        pageSize: Math.min(10, choices.length + 1),
        loop: false,
      },
    ]);

    if (selectedIndex >= 0 && selectedIndex < results.length) {
      const selectedMovie = results[selectedIndex];
      this.logSuccess(selectedMovie);
      return selectedMovie;
    }

    this.logger.warn("Nenhum filme selecionado para este arquivo.\n");
    return null;
  }

  private logSuccess(selectedMovie: TMDBMovieResult): void {
    this.logger.success(
      `\n✅ Selecionado: ${selectedMovie.title} (${
        selectedMovie.release_date?.split("-")[0] || "Ano desconhecido"
      })`
    );
  }

  private async processMovieDownload(
    movie: TMDBMovieResult,
    dirPath: string
  ): Promise<void> {
    try {
      this.fileHandler.createDirectory(dirPath);
      const movieDetails = await this.tmdbService.getMovieById(movie.id);

      if (movieDetails) {
        await this.fileHandler.saveJsonToFile(
          path.join(dirPath, "info.json"),
          movieDetails
        );

        await this.imageDownloader.downloadMovieImages(movieDetails, dirPath);
      }
    } catch (error) {
      this.logger.error(`Erro ao processar filme: ${error}`);
    }
  }
}
