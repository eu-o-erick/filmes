import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import type { MoviesByGenre } from "@/types/movies";
import ListMovies from "./lisMovies";
import { useEffect, useRef } from "react";

interface Props {
  movies: MoviesByGenre;
  colIndex: number;
  rowIndex: number;
}

export default function ListGenres({ movies, colIndex, rowIndex }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(rowIndex);
    }
  }, [rowIndex]);

  return (
    <div>
      <Swiper
        direction="vertical"
        slidesPerView={1.8}
        className="h-[calc(100vh-500px)]"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {Object.entries(movies).map(([genre, movieList], row) => (
          <SwiperSlide className="">
            <h2 className="text-xl font-light opacity-70 capitalize">
              {genre}
            </h2>
            <ListMovies movieList={movieList} colIndex={colIndex} row={row} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
