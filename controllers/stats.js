const Pollution = require("../models/pollution.js");

// To determine what data each endpoint needs, take a look at
// the jsFiddles provided in the highcharts website demos!

/*
  This one is going to need groupedBy in the query function to
  become a list if we want multilevel pie charts. (we'll have to 
  group on province and source)
*/
const pie = async (req, res) => {
  let db = req.db;
  try {
    const result = await Pollution.getPieData(db, req);
    res.send(result);
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const bar = async (req, res) => {
  let db = req.db;
  const filters = req.body.filters;
  const groupedBy = req.body.groupedBy;
  try {
    const result = await Pollution.getTotalsByGrouping(db, filters, groupedBy);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

/*
  For this one I was thinking maybe perform two queries,
  one for each province over the given time frame.
*/
const timeseries = async (req, res) => {
  let db = req.db;
  const filters = req.body.filters;
  try {
    const result = await Pollution.getTimeSeriesData(db, filters);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

// Pretty sure heat map can just use the same info as the bar function
const heatmap = async (req, res) => {};

module.exports = {
  pie,
  bar,
  heatmap,
  timeseries,
};
