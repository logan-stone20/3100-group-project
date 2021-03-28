import TopContainer from "./components/TopContainer";
import SideContainer from "./components/SideContainer";
import React from "react";
import { FormContextProvider } from "./context/FormContextProvider";
import "./App.css";
import Chart from "./components/ChartContainer";

const App = () => {
  return (
    <FormContextProvider>
      <TopContainer />
      <Chart />
      <div className="chart-sidebar-container">
      <SideContainer />
      </div>
    </FormContextProvider>

  );
};

export default App;
