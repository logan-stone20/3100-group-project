import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../context/FormContextProvider";
import "./SideContainer.css";
import SelectionCard from "./SelectionCard";
import ApplyFiltersButton from "./ApplyFilterButton";

const sourcesValues = [
  "Agriculture",
  "Commercial / Residential / Institutional",
  "Dust",
  "Electric Power Generation (Utilities)",
  "Fires",
  "Incineration and Waste",
  "Manufacturing",
  "Oil and Gas Industry",
  "Ore and Mineral Industries",
  "Paints and Solvents",
  "Transportation and Mobile Equipment",
];

const groupedByValues = ["Region", "Source", "Year"];

const toxins = {
  TPM: { label: "Total Particulate Matter (t)" },
  PM10: { label: "Particulate Matter (<10 microns) (t)" },
  PM25: { label: "Total Particulate Matter (<25 microns) (t)" },
  SOX: { label: "Sulfur Oxide (t)" },
  NOX: { label: "Nitrogen Oxide (t)" },
  VOC: { label: "Volatile Organic Compounds (t)" },
  CO: { label: "Carbon Monoxide (t)" },
  NH3: { label: "Ammonia (t)" },
  Pb: { label: "Lead (kg)" },
  Cd: { label: "Cadmium (kg)" },
  Hg: { label: "Mercury (kg)" },
  PAH: { label: "Poly-cyclic Aromatic Hydrocarbons (kg)" },
};

const SideContainer = () => {
  const {
    pollutionTypes,
    setPollutionTypes,
    sources,
    setSources,
    groupedBy,
    setGroupedBy,
  } = useContext(FormContext);

  const [groupedByText, setGroupedByText] = useState("");

  useEffect(() => {
    if (groupedBy.length > 0) {
      let string = "Your data will be grouped on";
      groupedBy.map((column, index) => {
        string += ` ${column}`;
        if (index < groupedBy.length - 1) {
          string += ", then";
        }
        if (index === groupedBy.length - 1) {
          string += ".";
        }
      });
      setGroupedByText(string);
    } else {
      setGroupedByText("");
    }
  }, [groupedBy]);

  const pollutionTypeChange = (e) => {
    if (e.target.checked && !pollutionTypes.includes(e.target.value)) {
      setPollutionTypes([...pollutionTypes, e.target.value]);
    } else {
      setPollutionTypes(
        pollutionTypes.filter((type) => type !== e.target.value)
      );
    }
  };

  const handleSourceChange = (e) => {
    if (e.target.checked && !sources.includes(e.target.value)) {
      setSources([...sources, e.target.value]);
    } else {
      setSources(sources.filter((source) => source !== e.target.value));
    }
  };

  const handleGroupedByChange = (e) => {
    if (e.target.checked && !groupedBy.includes(e.target.value)) {
      setGroupedBy([...groupedBy, e.target.value]);
    } else {
      setGroupedBy(groupedBy.filter((source) => source !== e.target.value));
    }
  };

  const pollutionTypeSelect = (
    <div className="select">
      <div className="sidebar-item-container">
        <form onInput={pollutionTypeChange}>
          {Object.keys(toxins).map((toxin) => (
            <div
              className={
                pollutionTypes.includes(toxin) ? "option selected" : "option"
              }
            >
              <div className="checkbox-label-container">
                <input
                  type="checkbox"
                  value={toxin}
                  id={`checkbox-${toxin}`}
                ></input>
                <div className={`checkbox-label`}>{toxins[toxin].label}</div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );

  const sourceSelect = (
    <div className="select">
      <div className="sidebar-item-container">
        <form onInput={handleSourceChange}>
          {sourcesValues.map((source) => (
            <div
              className={
                sources.includes(source) ? "option selected" : "option"
              }
            >
              <div className="checkbox-label-container">
                <input
                  type="checkbox"
                  value={source}
                  key={source}
                  id={`checkbox-${source}`}
                ></input>
                <div className={`checkbox-label`}>{source}</div>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );

  const group = (
    <div className="select">
      <div className="sidebar-item-container not-scrollable">
        <form onInput={handleGroupedByChange}>
          {groupedByValues.map((value) => (
            <div
              className={
                groupedBy.includes(value) ? "option selected" : "option"
              }
            >
              <div className={"checkbox-label-container"}>
                <input
                  type="checkbox"
                  value={value}
                  key={value}
                  id={`checkbox-${value}`}
                ></input>
                <div className={`checkbox-label`}>{value}</div>
              </div>
            </div>
          ))}
        </form>
      </div>
      <div className="grouped-by-alert">{groupedByText}</div>
      <ApplyFiltersButton />
    </div>
  );

  return (
    <div className="side-container">
      <SelectionCard children={pollutionTypeSelect} title="Pollution Types" />
      <SelectionCard children={sourceSelect} title="Pollution Sources" />
      <SelectionCard children={group} title="Group Data" />
    </div>
  );
};

export default SideContainer;
