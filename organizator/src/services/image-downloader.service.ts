import { Logger } from "../utils/logger";
import * as path from "path";
import { FileHandler } from "../utils/file-handler";
import { TMDBMovieDetails } from "../interfaces/tmdb.interface";

export class ImageDownloaderService {
  private readonly baseImageUrl = "https://image.tmdb.org/t/p/original";
  private logger: Logger;
  private fileHandler: FileHandler;

  constructor(logger: Logger, fileHandler: FileHandler) {
    this.logger = logger;
    this.fileHandler = fileHandler;
  }

  public async downloadMovieImages(
    movieDetails: TMDBMovieDetails,
    dirPath: string
  ): Promise<void> {
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

  private async downloadImage(
    imagePath: string,
    dirPath: string,
    imageType: string
  ): Promise<void> {
    try {
      const imageUrl = `${this.baseImageUrl}${imagePath}`;
      const fileName = `${imageType}${path.extname(imagePath)}`;
      const filePath = path.join(dirPath, fileName);

      await this.fileHandler.downloadImage(imageUrl, filePath);
    } catch (error) {
      this.logger.error(`Erro ao baixar ${imageType}: ${error}`);
      throw error;
    }
  }
}
