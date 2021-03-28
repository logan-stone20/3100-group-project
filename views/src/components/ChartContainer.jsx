import React, { useContext } from "react";
import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { FormContext } from "../context/FormContextProvider";
import "./ChartContainer.css";

const ChartContainer = () => {
  const { regions, graphType} = useContext(FormContext);
  console.log(graphType);
  const options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [1, 2, 1, 4, 3, 6],
        type: 'area'
      },
    ],
  }

  return (<div className="high-chart-container">
    <HighChartsReact highcharts={HighCharts} options={options} />
  </div>);
};
export default ChartContainer;
