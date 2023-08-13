import "./Banner.css";
import logo from "./images/logo-no-background.png";

function Banner() {
  return (
    <div className="Banner">
      <img className="Logo" src={logo} alt="Logo" />
    </div>
  );
}

export default Banner;
