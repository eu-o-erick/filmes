import { useEffect } from "react";
import { useFocusStore } from "@/store/useFocusStore";

export function KeyboardController() {
  const { rowIndex } = useFocusStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rowIndex]);

  return null;
}
