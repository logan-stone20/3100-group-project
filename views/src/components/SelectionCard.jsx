import React from "react";
import "./SelectionCard.css";

const SelectionCard = ({ children, title }) => {
  return (
    <div className="selection-card">
      <div className="title-bar">{title}</div>
      {children}
    </div>
  );
};

export default SelectionCard;
