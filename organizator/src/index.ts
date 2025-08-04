import { MovieService } from "./services/movie.service";
import fs from "fs";
import path from "path";
import { Logger } from "./utils/logger";

const logger = new Logger();

async function main() {
  try {
    // Verifica se foi passado um diretório como argumento
    const directoryPath = process.argv[2];

    if (!directoryPath) {
      throw new Error(
        "Por favor, forneça o caminho do diretório como argumento.\nExemplo: npm start /caminho/para/filmes"
      );
    }

    // Verifica se o caminho existe e é um diretório
    if (!fs.existsSync(directoryPath)) {
      throw new Error(`O diretório "${directoryPath}" não existe.`);
    }

    const stats = fs.statSync(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error(`O caminho "${directoryPath}" não é um diretório.`);
    }

    // Lê os arquivos do diretório
    const files = fs.readdirSync(directoryPath);

    // Filtra apenas arquivos (ignora subdiretórios)
    const movieFiles = files.filter((file) => {
      const filePath = path.join(directoryPath, file);
      return fs.statSync(filePath).isFile();
    });

    if (movieFiles.length === 0) {
      throw new Error(
        `Nenhum arquivo encontrado no diretório "${directoryPath}".`
      );
    }

    logger.info(`Encontrados ${movieFiles.length} arquivos no diretório...`);

    // Extrai títulos dos arquivos (remove extensões)
    const movieTitles = movieFiles.map((file) => {
      return path.parse(file).name; // Remove a extensão do arquivo
    });

    const movieService = new MovieService();
    await movieService.processMovieList(movieTitles);

    logger.success("Processamento concluído!");
  } catch (error) {
    logger.error(
      `Erro: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}

main();
