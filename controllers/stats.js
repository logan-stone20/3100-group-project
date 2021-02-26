const Pollution = require("../models/pollution.js");
const { connectToDB, getDb, closeDBConnection } = require("../utils/db.js");

const pie = async (req, res) => {
  let db = req.db;
  try {
    const result = await Pollution.getFilteredSearch(db, req);
    res.send(result);
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const bar = async (req, res) => {
  let db = req.db;
  const filters = req.body.filters;
  try {
    const result = await Pollution.getProvinceBarData(db, filters);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const heatmap = async (req, res) => {};

// Make all methods available for use.
module.exports = {
  pie,
  bar,
  heatmap,
};
