import React from "react";
import "./Banner.css";
import logo from "./images/logo-no-background.png";

function Banner() {
  const handleHelpClick = () => {
    // Replace 'https://your-help-page-url.com' with the actual URL of your help page
    window.open("https://github.com/Logan-Fouts/PicPurge/blob/GUI/README.md", "_blank");
  };

  return (
    <div className="Banner">
      <img className="Logo" src={logo} alt="Logo" />
      <button className="HelpButton" onClick={handleHelpClick}>
        ?
      </button>
    </div>
  );
}

export default Banner;
