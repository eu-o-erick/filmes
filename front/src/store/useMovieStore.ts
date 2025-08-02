import { create } from "zustand";

interface MovieStore {
  selectedMovie: string | null;
  setSelectedMovie: (name: string) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovie: "The Godfather - Part I",
  setSelectedMovie: (name) => set({ selectedMovie: name }),
}));
