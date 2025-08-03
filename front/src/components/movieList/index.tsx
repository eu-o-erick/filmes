import { useMoviesList } from "@/hooks/useMoviesList";
import { useFocusStore } from "@/store/useFocusStore";
import { useEffect } from "react";
import { useMovieStore } from "@/store/useMovieStore";
import ListGenres from "./listGenres";
import cn from "@/utils/cn";

function MovieList() {
  const { movies, loading, error } = useMoviesList();
  const { setSelectedMovie } = useMovieStore();
  const { rowIndex, columnIndexes } = useFocusStore();

  useEffect(() => {
    const genreKeys = Object.keys(movies);
    const genre = genreKeys[rowIndex];
    const colIndex = columnIndexes[rowIndex] ?? 0;

    const movie = movies[genre]?.[colIndex];

    if (movie) {
      setSelectedMovie(movie);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowIndex, columnIndexes]);

  if (loading) return <p>Carregando filmes...</p>;
  if (error) return <p>{error}</p>;
  if (Object.keys(movies).length === 0) return <p>Nenhum filme encontrado.</p>;

  const colIndex = columnIndexes[rowIndex] ?? 0;

  return (
    <div
      className={cn("px-36 h-[calc(100vh-500px)] relative overflow-hidden", {
        "mask-fade-top": rowIndex === Object.keys(movies).length - 1,
        "mask-fade-bottom": rowIndex !== Object.keys(movies).length - 1,
      })}
    >
      <ListGenres movies={movies} colIndex={colIndex} rowIndex={rowIndex} />
    </div>
  );
}

export default MovieList;
