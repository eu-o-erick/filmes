import { STATIC_BASE_URL } from "@/constants";
import { type MovieInfo } from "@/types/movie";

export async function getMovieInfo(name: string): Promise<MovieInfo> {
  const res = await fetch(`${STATIC_BASE_URL}api/info?name=${encodeURI(name)}`);

  if (!res.ok) throw new Error("Erro ao buscar info do filme");
  return res.json();
}
