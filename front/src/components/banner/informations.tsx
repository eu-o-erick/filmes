import { useMovieInfo } from "@/hooks/useMovieInfo";
import { useMovieStore } from "@/store/useMovieStore";
import { formatRuntime } from "@/utils/formatRuntime";
import { getAssetUrl } from "@/utils/getAssetUrl";
import { GoDotFill } from "react-icons/go";
import { Fragment } from "react/jsx-runtime";

function Informations() {
  const { info, loading, error } = useMovieInfo();
  const selectedMovie = useMovieStore((s) => s.selectedMovie);

  if (!selectedMovie) return <p>Nenhum filme selecionado.</p>;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!info) return null;

  return (
    <div className="relative flex gap-5 py-24 px-36">
      <img
        src={getAssetUrl(selectedMovie) + "/thumbnail.jpg"}
        alt={info.title}
        className="w-56 shadow-[3px_3px_10px_#0006] rounded-md"
      />

      <div className="flex flex-col justify-between pt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl">
            {info.title}
            <span className="ml-8 opacity-50">
              ({info.release_date.split("-")[0]})
            </span>
          </h2>
          <p className="mb-2 opacity-70 text-lg">{info.tagline}</p>

          <p className="opacity-80">{info.overview}</p>

          <p>{formatRuntime(info.runtime)}</p>
        </div>

        <p className="flex items-center gap-3 text-lg">
          {info.genres.map((genre, i) => {
            if (info.genres.length - 1 > i) {
              return (
                <Fragment key={i}>
                  <span>{genre.name}</span>
                  <GoDotFill className="w-2 mt-0.5" />
                </Fragment>
              );
            }
            return <span key={i}>{genre.name}</span>;
          })}
        </p>
      </div>
    </div>
  );
}

export default Informations;
