import Backdrop from "./backdrop";
import Informations from "./informations";

function Banner() {
  return (
    <div className="h-[80vh] -mb-56 relative">
      <Backdrop />
      <Informations />
    </div>
  );
}

export default Banner;
