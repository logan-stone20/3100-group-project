import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <div>&copy;{new Date().getFullYear()} CA PollutionStats</div>
      </div>
    </div>
  );
}

export default Footer;
