import React from 'react';
import HighCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';

/*  Dummy Chart to test High Charts */
const options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'My chart'
    },
    series: [
      {
        data: [1, 2, 1, 4, 3, 6]
      }
    ]
  };

const Chart = () => (
  <div>
      <HighChartsReact highcharts={HighCharts} options={options} />
  </div>
);

export default Chart;