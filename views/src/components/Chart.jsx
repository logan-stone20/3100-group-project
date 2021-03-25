import React, { useContext } from "react";
import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { FormContext, FormContextProvider } from "../context/FormContextProvider";

const Chart = () => {
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

  return (<div>
    <HighChartsReact highcharts={HighCharts} options={options} />
  </div>);
};
export default Chart;
