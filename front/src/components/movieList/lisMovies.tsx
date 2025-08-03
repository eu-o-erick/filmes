import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import MovieItem from "./movieItem";
import { useFocusStore } from "@/store/useFocusStore";
import { useEffect, useRef } from "react";

interface Props {
  movieList: string[];
  colIndex: number;
  row: number;
}

export default function ListMovies({ movieList, colIndex, row }: Props) {
  const { rowIndex, setRowIndex, setColumnIndexForRow, columnIndexes } =
    useFocusStore();

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const currentColumnIndex = columnIndexes[row] - 3;
    if (swiperRef.current && typeof currentColumnIndex === "number") {
      swiperRef.current.slideTo(currentColumnIndex);
    }
  }, [columnIndexes, row]);

  return (
    <Swiper
      slidesPerView={8}
      spaceBetween={40}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
    >
      {movieList.map((movie, col) => (
        <SwiperSlide className="px-2 py-4">
          <MovieItem
            key={col}
            movie={movie}
            isFocused={rowIndex === row && colIndex === col}
            focus={() => {
              setRowIndex(row);
              setColumnIndexForRow(row, col);
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
