const Pollution = require("../models/pollution.js");
const { connectToDB, getDb, closeDBConnection } = require("../utils/db.js");

const pie = async (req, res) => {
  let db = req.db;
  try {
    const result = await Pollution.getFilteredSearch(db, req);
    res.send(obj);
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const bar = async (req, res) => {};

const heatmap = async (req, res) => {};

// Make all methods available for use.
module.exports = {
  pie,
  bar,
  heatmap,
};
