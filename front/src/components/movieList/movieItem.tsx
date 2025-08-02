import cn from "@/utils/cn";
import { getAssetUrl } from "@/utils/getAssetUrl";

function MovieItem({
  movie,
  isFocused,
  focus,
}: {
  movie: string;
  isFocused: boolean;
  focus: () => void;
}) {
  return (
    <div
      onClick={focus}
      className={cn("cursor-pointer hover:scale-[103%] transition-all", {
        "scale-[103%]": isFocused,
      })}
    >
      <img
        src={getAssetUrl(movie) + "/thumbnail.jpg"}
        className={cn(
          "shadow-[3px_3px_10px_#0006] rounded-md outline-3 outline-transparent -outline-offset-1",
          {
            "outline-font": isFocused,
          }
        )}
      />
    </div>
  );
}

export default MovieItem;
