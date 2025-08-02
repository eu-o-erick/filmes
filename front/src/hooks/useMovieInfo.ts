import { useEffect, useState } from "react";
import { useMovieStore } from "@/store/useMovieStore";
import { getMovieInfo } from "@/lib/api";
import { type MovieInfo } from "@/types/movie";

export function useMovieInfo() {
  const selectedMovie = useMovieStore((s) => s.selectedMovie);
  const [info, setInfo] = useState<MovieInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMovie) return;

    setLoading(true);
    setError(null);

    getMovieInfo(selectedMovie)
      .then(setInfo)
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar o filme.");
      })
      .finally(() => setLoading(false));
  }, [selectedMovie]);

  return { info, loading, error };
}
