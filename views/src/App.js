import TopContainer from "./components/TopContainer";
import SideContainer from "./components/SideContainer";
import React from "react";
import { FormContextProvider } from "./context/FormContext";
import "./App.css";

const App = () => {
  return (
    <FormContextProvider>
      <TopContainer />
      <div className="chart-sidebar-container">
        <SideContainer />
      </div>
    </FormContextProvider>
  );
};

export default App;
