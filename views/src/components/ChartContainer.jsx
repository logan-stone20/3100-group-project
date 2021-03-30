import React, { useContext, useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { FormContext } from "../context/FormContextProvider";
import "./ChartContainer.css";

const allRegions = [
  "NL",
  "PE",
  "NS",
  "QC",
  "NB",
  "ON",
  "MB",
  "SK",
  "AB",
  "BC",
  "YT",
  "NT",
  "NU",
  "Unspecified",
];

const allSources = [
  "Agriculture",
  "Commercial / Residential / Institutional",
  "Dust",
  "Electric Power Generation (Utilities)",
  "Fires",
  "Incineration and Waste",
  "Manufacturing",
  "Oil and Gas Industry",
  "Ore and Mineral Industries",
  "Paints and Solvents",
  "Transportation and Mobile Equipment",
];

const ChartContainer = () => {
  const {
    regions,
    sources,
    groupedBy,
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
              text: `Pollution Totals by year: ${yearStart} - ${yearEnd}`,
            },
            series: [],
            chart: {
              type: "line",
            },
            tooltip: {
              valueSuffix: " tonnes",
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
              type: "line",
            };
            const years = data.result[region];
            const regionData = [];

            // for each region, go over each year and add a data point with total pollution
            // for that year.
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
              highcharts={Highcharts}
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

          // if there is only 1 result and _id is null, show pollution types as
          // columns, otherwise, have a category for each grouping.
          if (data.result.length === 1 && !data.result[0]?._id) {
            newOptions = {
              title: {
                text: `Pollution Totals from ${yearStart} to ${yearEnd}`,
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
              type: "bar",
            };
            newOptions.series = [entry];

            setGraph(
              <HighChartsReact
                highcharts={Highcharts}
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
                text: `Pollution Totals grouped on ${groupedBy} from ${yearStart} to ${yearEnd}`,
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

              newOptions.series.push({
                name: toxin,
                type: "bar",
                data: toxinArray,
              });
            });
            setGraph(
              <HighChartsReact
                highcharts={Highcharts}
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
      pie: {
        generate: () => {
          if (!data || !shouldChartUpdate) return;
          let newOptions = {};

          newOptions = {
            title: {
              text: `Pollution totals by percentage grouped on ${groupedBy.join(
                ", "
              )} from ${yearStart} to ${yearEnd}`,
            },
            chart: {
              type: "pie",
            },
            series: [],
            tooltip: {
              valueSuffix: "%",
            },
          };

          const yearRangeArray = [];
          for (let i = yearStart; i <= yearEnd; i++) {
            yearRangeArray.push(i);
          }

          const groupToVar = {
            Region: regions.length > 0 ? regions : allRegions,
            Source: sources.length > 0 ? sources : allSources,
            Year: yearRangeArray,
          };

          const colors = Highcharts.getOptions().colors;

          const innerGroupValues = groupToVar[groupedBy[0]];
          const outerGroupValues = groupToVar[groupedBy[1]];
          const formattedData = [];

          // total amount of pollution for entire query result
          const grandTotal = data.result.reduce(
            (total, result) =>
              total +
              Object.keys(result)
                .filter((key) => key !== "_id")
                .reduce((total, toxin) => {
                  return total + result[toxin];
                }, 0),
            0
          );

          innerGroupValues.forEach((value, index) => {
            const individualVals = [];
            const matchingResults = data.result.filter(
              (result) => result._id[groupedBy[0]] === value
            );

            // total amount of pollution for inner grouping result
            const groupTotal = matchingResults.reduce(
              (total, value) =>
                total +
                Object.keys(value)
                  .filter((key) => key !== "_id")
                  .reduce((total, toxin) => {
                    return total + value[toxin];
                  }, 0),
              0
            );

            if (groupedBy.length > 1) {
              outerGroupValues.forEach((inner) => {
                // total amount of pollution for outer grouping result
                const total =
                  (matchingResults
                    .filter((result) => result._id[groupedBy[1]] === inner)
                    .reduce(
                      (total, value) =>
                        total +
                        Object.keys(value)
                          .filter((key) => key !== "_id")
                          .reduce((total, toxin) => {
                            return total + value[toxin];
                          }, 0),
                      0
                    ) /
                    grandTotal) *
                  100;
                individualVals.push(total);
              });
            }

            formattedData.push({
              // y is the value displayed in the pie graph.
              y: (groupTotal / grandTotal) * 100,
              color: colors[index],
              // drilldown contains data for the outer layer
              drilldown: {
                name: matchingResults[0]._id[value],
                categories: outerGroupValues,
                data: individualVals,
              },
            });
          });

          const innerData = [];
          const outerData = [];

          for (let i = 0; i < formattedData.length; i++) {
            innerData.push({
              name: innerGroupValues[i],
              y: formattedData[i].y,
              color: formattedData[i].color,
            });

            if (groupedBy.length > 1) {
              for (let j = 0; j < formattedData[i].drilldown.data.length; j++) {
                const brightness =
                  0.2 - j / formattedData[i].drilldown.data.length / 5;
                outerData.push({
                  name: formattedData[i].drilldown.categories[j],
                  y: formattedData[i].drilldown.data[j],
                  color: Highcharts.color(formattedData[i].color)
                    .brighten(brightness)
                    .get(),
                });
              }
            }
          }

          newOptions.series = [
            {
              name: groupedBy[0],
              data: innerData,
              type: "pie",
              size: "60%",
              dataLabels: {
                formatter: function () {
                  // label will display if total is > 5%
                  return this.y > 5 ? this.point.name : null;
                },
                color: "#ffffff",
                distance: -30,
              },
            },
          ];

          if (groupedBy.length > 1) {
            newOptions.series.push({
              name: groupedBy[1],
              data: outerData,
              size: "80%",
              innerSize: "60%",
              dataLabels: {
                formatter: function () {
                  // display only if larger than 1
                  return this.y > 1
                    ? "<b>" +
                        this.point.name +
                        ":</b> " +
                        this.y.toFixed(2) +
                        "%"
                    : null;
                },
              },
            });
          }

          console.log(newOptions);

          setGraph(
            <HighChartsReact
              highcharts={Highcharts}
              ref={chartRef}
              options={newOptions}
              containerProps={{
                style: { height: "78vh", width: "80vw", paddingTop: "1rem" },
              }}
            />
          );
        },
      },
    };
    if (shouldChartUpdate) {
      if (chartRef?.current?.chart) {
        chartRef.current.chart.xAxis[0]?.remove();
        chartRef.current.chart.yAxis[0]?.remove();
      }
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
