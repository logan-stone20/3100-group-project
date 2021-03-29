import React, { useEffect, useState } from "react";
import axios from "axios";

export const FormContext = React.createContext();

export default FormContext;

export const FormContextProvider = (props) => {
  const [regions, setRegions] = useState([]);
  const [yearStart, setYearStart] = useState(1994);
  const [yearEnd, setYearEnd] = useState(2018);
  const [graphType, setGraphType] = useState("pie");
  const [pollutionTypes, setPollutionTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [groupedBy, setGroupedBy] = useState([]);
  const [data, setData] = useState(null);
  const [shouldChartUpdate, setShouldChartUpdate] = useState(false);

  useEffect(() => {
    setShouldChartUpdate(false);
  }, [
    regions,
    yearStart,
    yearEnd,
    graphType,
    pollutionTypes,
    sources,
    groupedBy,
  ]);

  const sendRequest = () => {
    const body = {
      filters: { yearStart: parseInt(yearStart), yearEnd: parseInt(yearEnd) },
    };

    if (regions.length > 0) {
      body.filters.regions = regions;
    }

    if (sources.length > 0) {
      body.filters.sources = sources;
    }

    if (pollutionTypes.length > 0) {
      body.filters.toxins = pollutionTypes;
    }

    if (groupedBy.length > 0) {
      body.groupedBy = groupedBy;
    }

    axios
      .post(`http://localhost:3001/stats/${graphType}`, body)
      .then((resp) => {
        if (resp?.data?.err) {
          alert(JSON.stringify(resp?.data?.err));
        } else {
          setData(resp.data);
          setShouldChartUpdate(true);
        }
      })
      .catch((error) => alert(error));
  };

  return (
    <FormContext.Provider
      value={{
        regions,
        setRegions,
        yearStart,
        setYearStart,
        yearEnd,
        setYearEnd,
        graphType,
        setGraphType,
        pollutionTypes,
        setPollutionTypes,
        sources,
        setSources,
        groupedBy,
        setGroupedBy,
        sendRequest,
        setData,
        data,
        shouldChartUpdate,
        setShouldChartUpdate,
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};
