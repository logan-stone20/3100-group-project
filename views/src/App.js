import TopContainer  from "./components/TopContainer";
import React from "react";
import { FormContextProvider } from "./context/FormContext";

const App = () => {
  return (
    <FormContextProvider>
      <TopContainer />
    </FormContextProvider>
  );
};

export default App;
