import { useEffect, useRef } from "react";
import { useFocusStore } from "@/store/useFocusStore";
import { useNavigate } from "react-router";
import { useMovieStore } from "@/store/useMovieStore";

export function KeyboardController() {
  const { rowIndex } = useFocusStore();
  const lastKeyPress = useRef(0);
  const cooldown = 400;
  const navigate = useNavigate();
  const { selectedMovie } = useMovieStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const now = Date.now();

      if (now - lastKeyPress.current < cooldown) return;
      lastKeyPress.current = now;

      const {
        rowIndex,
        setRowIndex,
        setColumnIndexForRow,
        getColumnIndexForRow,
        moviesByGenres,
      } = useFocusStore.getState();

      const currentCol = getColumnIndexForRow(rowIndex);
      const maxCol = (moviesByGenres[rowIndex] ?? 1) - 1;
      const maxRow = Object.keys(moviesByGenres).length - 1;

      if (e.key === "ArrowLeft") {
        setColumnIndexForRow(rowIndex, Math.max(0, currentCol - 1));
      }

      if (e.key === "ArrowRight") {
        setColumnIndexForRow(rowIndex, Math.min(maxCol, currentCol + 1));
      }

      if (e.key === "ArrowDown") {
        setRowIndex(Math.min(maxRow, rowIndex + 1));
      }

      if (e.key === "ArrowUp") {
        setRowIndex(Math.max(0, rowIndex - 1));
      }

      if (e.key === "Enter") {
        navigate(`/${encodeURI(selectedMovie ?? "")}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rowIndex, navigate, selectedMovie]);

  return null;
}
