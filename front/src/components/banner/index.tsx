import Backdrop from "./backdrop";
import Informations from "./informations";

function Banner() {
  return (
    <div className="h-[500px] relative">
      <Backdrop />
      <Informations />
    </div>
  );
}

export default Banner;
