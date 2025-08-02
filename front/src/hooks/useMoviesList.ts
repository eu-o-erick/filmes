import { getMovies } from "@/lib/api";
import { useFocusStore } from "@/store/useFocusStore";
import { useMovieStore } from "@/store/useMovieStore";
import type { MoviesByGenre } from "@/types/movies";
import { useEffect, useState } from "react";

export function useMoviesList() {
  const [movies, setMovies] = useState<MoviesByGenre>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setSelectedMovie = useMovieStore((s) => s.setSelectedMovie);
  const setMoviesByGenres = useFocusStore((s) => s.setMoviesByGenres);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getMovies()
      .then((moviesData) => {
        setMovies(moviesData);

        const genres = Object.keys(moviesData);
        const moviesByGenres: Record<number, number> = {};

        genres.forEach((genre, index) => {
          moviesByGenres[index] = moviesData[genre].length;
        });

        setMoviesByGenres(moviesByGenres);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar o filme.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const genres = Object.keys(movies);
      const firstGenreKey = genres[0];
      const firstMovie = movies[firstGenreKey][0];

      setSelectedMovie(firstMovie);
    } catch {
      setSelectedMovie(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  return { movies, loading, error };
}
