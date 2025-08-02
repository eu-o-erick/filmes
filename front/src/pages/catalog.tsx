import MovieList from "@/components/movieList";
import Banner from "../components/banner";
import { KeyboardController } from "@/components/KeyboardController";

function CatalogPage() {
  return (
    <div className="flex flex-col">
      <KeyboardController />
      <Banner />
      <MovieList />
    </div>
  );
}

export default CatalogPage;
