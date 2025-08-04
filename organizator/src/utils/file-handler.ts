import * as fs from "fs";
import { Logger } from "./logger";
import axios from "axios";

export class FileHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public createDirectory(dirPath: string): void {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch {}
  }

  public saveJsonToFile(filePath: string, data: any): void {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      this.logger.error(`Erro ao salvar arquivo: ${filePath}`);
      throw error;
    }
  }

  public async downloadImage(
    imageUrl: string,
    filePath: string
  ): Promise<void> {
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
  }
}
