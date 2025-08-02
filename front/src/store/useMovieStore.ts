import { create } from "zustand";

interface MovieStore {
  selectedMovie: string | null;
  setSelectedMovie: (name: string | null) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovie: null,
  setSelectedMovie: (name) => set({ selectedMovie: name }),
}));
