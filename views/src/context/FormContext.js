import React, { useState } from "react";

export const FormContext = React.createContext();

export default FormContext;

export const FormContextProvider = (props) => {
  const [regions, setRegions] = useState([]);
  const [yearStart, setYearStart] = useState(1994);
  const [yearEnd, setYearEnd] = useState(2018);
  const [graphType, setGraphType] = useState(null);

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
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};
