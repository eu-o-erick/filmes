import { useMovieStore } from "@/store/useMovieStore";
import { getAssetUrl } from "@/utils/getAssetUrl";

function Backdrop() {
  const { selectedMovie } = useMovieStore();

  if (!selectedMovie) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-[70vh]">
      <img
        src={getAssetUrl(selectedMovie) + "/backdrop.jpg"}
        className="w-full h-full object-cover"
      />

      <div className="w-full h-full absolute top-0 bg-gradient-to-t from-primary/100 via-primary/95 to-primary/70" />
    </div>
  );
}
export default Backdrop;
