import axios from "axios";
import inquirer from "inquirer";
import {
  TMDBMovieResult,
  TMDBMovieDetails,
} from "../interfaces/tmdb.interface";
import { TMDBService } from "./tmdb.service";
import { Logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";

export class MovieService {
  private tmdbService: TMDBService;
  private logger: Logger;
  private moviesDir: string;
  private readonly baseImageUrl = "https://image.tmdb.org/t/p/original";

  constructor() {
    this.tmdbService = new TMDBService();
    this.logger = new Logger();
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

      const dirPath = path.join(this.moviesDir, selectedMovie.title);

      try {
        fs.mkdirSync(dirPath, { recursive: true });
      } catch {}

      const movieDetails = await this.tmdbService.getMovieById(
        selectedMovie.id
      );
      if (movieDetails) {
        // Salva as informações do filme
        await this.saveMovieDetailsToJson(movieDetails, dirPath);

        // Baixa o poster e o backdrop
        const downloadPromises = [];

        if (movieDetails.poster_path) {
          downloadPromises.push(
            this.downloadImage(movieDetails.poster_path, dirPath, "poster")
          );
        } else {
          this.logger.warn("Nenhum poster disponível para este filme");
        }

        if (movieDetails.backdrop_path) {
          downloadPromises.push(
            this.downloadImage(movieDetails.backdrop_path, dirPath, "backdrop")
          );
        } else {
          this.logger.warn("Nenhum backdrop disponível para este filme");
        }

        await Promise.all(downloadPromises);
      }
    } else {
      this.logger.warn("Nenhum filme selecionado para este arquivo.\n");
    }
  }

  private async downloadImage(
    imagePath: string,
    dirPath: string,
    imageType: string
  ): Promise<void> {
    try {
      const imageUrl = `${this.baseImageUrl}${imagePath}`;
      const fileName = `${imageType}${path.extname(imagePath)}`;
      const filePath = path.join(dirPath, fileName);

      const response = await axios({
        method: "get",
        url: imageUrl,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => {
          resolve();
        });
        writer.on("error", reject);
      });
    } catch (error) {
      this.logger.error(`Erro ao baixar ${imageType}: ${error}`);
    }
  }

  private async saveMovieDetailsToJson(
    movieDetails: TMDBMovieDetails,
    dirPath: string
  ): Promise<void> {
    const filePath = path.join(dirPath, "info.json");

    try {
      fs.writeFileSync(
        filePath,
        JSON.stringify(movieDetails, null, 2),
        "utf-8"
      );
    } catch (error) {
      this.logger.error(`Erro ao salvar informações do filme: ${error}`);
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
