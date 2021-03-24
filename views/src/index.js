import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Footer from "./components/Footer";
import reportWebVitals from "./reportWebVitals";
import Chart from "./components/DummyChart";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Chart />
    <Footer />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();