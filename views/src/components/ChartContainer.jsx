import React, { useContext, useEffect, useState, useRef } from "react";
import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { FormContext } from "../context/FormContextProvider";
import "./ChartContainer.css";

const typeToLabel = {
  timeseries: "Pollution Totals",
  bar: "Bar",
};

const ChartContainer = () => {
  const {
    graphType,
    data,
    yearStart,
    yearEnd,
    shouldChartUpdate,
    setShouldChartUpdate,
  } = useContext(FormContext);

  const chartRef = useRef(null);

  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const graphTypeMap = {
      timeseries: {
        generate: () => {
          if (!data || !shouldChartUpdate) return;
          let newOptions = {};
          newOptions = {
            title: {
              text: `${typeToLabel[graphType]} from ${yearStart} to ${yearEnd}`,
            },
            series: [],
            chart: {
              type: "line",
            },
            xAxis: {
              categories: Object.values(data.result)[0].map(
                (item) => item._id.Year
              ),
              title: {
                text: "Years",
              },
            },
            yAxis: {
              title: {
                text: "Pollution in Tonnes (t)",
              },
            },
          };
          Object.keys(data.result).forEach((region) => {
            const entry = {
              name: region,
            };
            const years = data.result[region];
            const regionData = [];
            years.forEach((year) => {
              regionData.push(
                Object.keys(year).reduce((sum, key) => {
                  if (key !== "_id") {
                    sum += year[key];
                  }
                  return sum;
                }, 0)
              );
            });
            entry.data = regionData;
            newOptions.series.push(entry);
          });

          setGraph(
            <HighChartsReact
              highcharts={HighCharts}
              ref={chartRef}
              options={newOptions}
              containerProps={{
                style: { height: "78vh", width: "80vw", paddingTop: "1rem" },
              }}
            />
          );
        },
      },
      bar: {
        generate: () => {
          if (!data || !shouldChartUpdate) return;
          let newOptions = {};

          if (data.result.length === 1 && !data.result[0]?._id) {
            newOptions = {
              title: {
                text: `${typeToLabel[graphType]} from ${yearStart} to ${yearEnd}`,
              },
              chart: {
                type: "bar",
              },
              xAxis: {
                categories: Object.keys(data.result[0]).filter(
                  (toxin) => toxin !== "_id"
                ),
                title: {
                  text: "Pollution Types",
                },
              },
              tooltip: {
                valueSuffix: " tonnes",
              },
              series: [],
            };

            const toxins = Object.keys(data.result[0]).filter(
              (toxin) => toxin !== "_id"
            );

            const entry = {
              name: "Total",
              data: toxins.map((toxin) => data.result[0][toxin]),
            };
            newOptions.series = [entry];

            setGraph(
              <HighChartsReact
                highcharts={HighCharts}
                ref={chartRef}
                options={newOptions}
                containerProps={{
                  style: { height: "78vh", width: "80vw", paddingTop: "1rem" },
                }}
              />
            );
          } else {
            const groupedOn = Object.keys(data.result[0]._id).join(", ");
            let newOptions = {
              title: {
                text: `${typeToLabel[graphType]} from ${yearStart} to ${yearEnd}`,
              },
              chart: {
                type: "bar",
              },
              series: [],
              xAxis: {
                categories: data.result.map((result) =>
                  Object.values(result._id).join(", ")
                ),
                title: {
                  text: `${groupedOn}`,
                },
              },
              tooltip: {
                valueSuffix: " tonnes",
              },
              yAxis: {
                min: 0,
                title: {
                  text: "Pollution Ammounts (t)",
                },
              },
            };

            const toxins = Object.keys(data.result[0]).filter(
              (toxin) => toxin !== "_id"
            );

            toxins.forEach((toxin) => {
              let toxinArray = [];
              data.result.forEach((grouping) => {
                toxinArray.push(grouping[toxin]);
              });

              newOptions.series.push({ name: toxin, data: toxinArray });
            });
            setGraph(
              <HighChartsReact
                highcharts={HighCharts}
                ref={chartRef}
                options={newOptions}
                containerProps={{
                  style: { height: "78vh", width: "80vw", paddingTop: "1rem" },
                }}
              />
            );
          }
        },
      },
    };
    if (shouldChartUpdate) {
      graphTypeMap[graphType]?.generate();
      setShouldChartUpdate(false);
    }
  }, [
    data,
    graphType,
    setShouldChartUpdate,
    shouldChartUpdate,
    yearEnd,
    yearStart,
  ]);

  return graph;
};
export default ChartContainer;
