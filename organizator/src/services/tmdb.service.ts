import axios from "axios";
import {
  TMDBMovieResult,
  TMDBSearchResponse,
  TMDBMovieDetails,
} from "../interfaces/tmdb.interface";
import dotenv from "dotenv";

dotenv.config();

export class TMDBService {
  private readonly accessToken: string;
  private readonly baseUrl: string = "https://api.themoviedb.org/3";

  constructor() {
    if (!process.env.TMDB_ACCESS_TOKEN) {
      throw new Error("TMDB_ACCESS_TOKEN não encontrado no .env");
    }
    this.accessToken = process.env.TMDB_ACCESS_TOKEN;
  }

  public async searchMovie(query: string): Promise<TMDBMovieResult[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/search/movie?query=${encodedQuery}&include_adult=false&language=pt-BR&page=1`;

      const response = await axios.get<TMDBSearchResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          accept: "application/json",
        },
      });

      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Erro na requisição para "${query}":`, {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error(`Erro ao buscar filme: ${query}`, error);
      }
      return [];
    }
  }

  public async getMovieById(id: number): Promise<TMDBMovieDetails | null> {
    try {
      const url = `${this.baseUrl}/movie/${id}?language=pt-BR`;

      const response = await axios.get<TMDBMovieDetails>(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Erro ao buscar filme pelo ID ${id}:`, {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error(`Erro ao buscar filme pelo ID ${id}:`, error);
      }
      return null;
    }
  }
}
