import { create } from "zustand";

interface FocusStore {
  rowIndex: number;
  columnIndexes: Record<number, number>;
  moviesByGenres: Record<number, number>;
  setRowIndex: (index: number) => void;
  setColumnIndexForRow: (row: number, col: number) => void;
  getColumnIndexForRow: (row: number) => number;
  setMoviesByGenres: (movies: Record<number, number>) => void;
}

export const useFocusStore = create<FocusStore>((set, get) => ({
  rowIndex: 0,
  columnIndexes: { 0: 0 },
  moviesByGenres: {},

  setRowIndex: (index) => set({ rowIndex: index }),

  setColumnIndexForRow: (row, col) =>
    set((state) => ({
      columnIndexes: {
        ...state.columnIndexes,
        [row]: col,
      },
    })),

  getColumnIndexForRow: (row) => {
    const index = get().columnIndexes[row];
    return index ?? 0;
  },
  setMoviesByGenres: (movies) => set({ moviesByGenres: movies }),
}));
