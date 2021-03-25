import TopContainer  from "./components/TopContainer";
import Chart from "./components/Chart";
import React from "react";
import FormContextProvider from "./context/FormContextProvider";

const App = () => {
  return (
    <FormContextProvider>
      <TopContainer />
      <Chart />
    </FormContextProvider>

  );
};

export default App;
