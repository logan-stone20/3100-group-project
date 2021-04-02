import React, { useContext } from "react";
import { FormContext } from "../context/FormContextProvider";
import "./TopContainer.css";
import SelectionCard from "./SelectionCard";

const checkboxRegions = {
  NL: {
    label: "Newfoundland and Labrador",
  },
  PE: {
    label: "Prince Edward Island",
  },
  NS: {
    label: "Nova Scotia",
  },
  QC: {
    label: "Quebec",
  },
  NB: {
    label: "New Brunswick",
  },
  ON: {
    label: "Ontario",
  },
  MB: {
    label: "Manitoba",
  },
  SK: {
    label: "Saskatoon",
  },
  AB: {
    label: "Alberta",
  },
  BC: {
    label: "British Columbia",
  },
  YT: {
    label: "Yukon",
  },
  NT: {
    label: "Northwest Territories",
  },
  NU: {
    label: "Nunavut",
  },
};

const TopContainer = () => {
  const {
    regions,
    setRegions,
    yearStart,
    setYearStart,
    yearEnd,
    setYearEnd,
    setGraphType,
  } = useContext(FormContext);

  const graphTypeChildren = (
    <div className="select" onInput={(e) => setGraphType(e.target.value)}>
      <select>
        <option value="pie">Pie Chart</option>
        <option value="timeseries">Time Series</option>
        <option value="bar">Bar Graph</option>
        <option value="heatmap">Heatmap</option>
      </select>
    </div>
  );

  const handleInputChange = (e) => {
    if (e.target.checked && !regions.includes(e.target.value)) {
      setRegions([...regions, e.target.value]);
    } else {
      setRegions(regions.filter((region) => region !== e.target.value));
    }
  };
  const yearSelect = (
    <div className="slide-container">
      <label htmlFor="yearStart">Starting Year: {yearStart}</label>
      <input
        onInput={(e) => setYearStart(e.target.value)}
        type="range"
        min="1994"
        max="2018"
        className="slider"
        id="yearStart"
      />
      <label htmlFor="yearEnd">End Year: {yearEnd}</label>
      <input
        onInput={(e) => setYearEnd(e.target.value)}
        type="range"
        min="1994"
        max="2018"
        className="slider"
        id="yearEnd"
      />
      {yearStart > yearEnd && (
        <div className="red-text">
          Please ensure starting year is less than or equal to end year.
        </div>
      )}
    </div>
  );

  const provinceSelect = (
    <div className="select provinces">
      <div className="province-container">
        <form onInput={handleInputChange}>
          {Object.keys(checkboxRegions).map((region) => (
            <div
              className={
                regions.includes(region) ? "option selected" : "option"
              }
            >
              <div className="checkbox-label-container">
                <input
                  type="checkbox"
                  value={region}
                  id={`checkbox-${region}`}
                ></input>
                <div className={`checkbox-label`}>
                  {checkboxRegions[region].label}
                </div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
  return (
    <div className="top-container">
      <SelectionCard children={graphTypeChildren} title="Select a Graph type" />
      <SelectionCard children={yearSelect} title="Year Range" />
      <SelectionCard children={provinceSelect} title="Regions" />
    </div>
  );
};

export default TopContainer;
