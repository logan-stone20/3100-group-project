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
      <div className="chart-sidebar-container">
        <div className="highchart-container">
          <Chart />
        </div>
        <SideContainer />
      </div>
    </FormContextProvider>
  );
};

export default App;
