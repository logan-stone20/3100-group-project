import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../context/FormContextProvider";
import "./ApplyFiltersButton.css";

const ApplyFiltersButton = () => {
  const { data, sendRequest } = useContext(FormContext);

  return (
    <button className="apply-filters" onClick={sendRequest}>
      <strong>Apply Filters</strong>
    </button>
  );
};

export default ApplyFiltersButton;
