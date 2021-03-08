const Pollution = require("../models/pollution.js");
const {
  validator,
  barRequestSchema,
  heatmapRequestSchema,
  timeSeriesRequestSchema,
  pieRequestSchema,
} = require("../utils/schemas");

const formatValidationError = (validationInstance) => {
  const errObj = { err: {} };
  validationInstance.errors.forEach((err) => {
    const property = err.property.replace("instance.", "");
    errObj.err[property] = err.message;
  });
  return errObj;
};

const outputLogForRequest = (path, numberOfResults) => {
  console.log(
    `${path}: Request recieved. ${numberOfResults} results fetched from database.`
  );
};

const pie = async (req, res) => {
  const validatorRes = validator.validate(req.body, pieRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  try {
    const filters = req.body.filters;
    const groupedBy = req.body.groupedBy;
    const result = await Pollution.getTotalsByGrouping(db, filters, groupedBy);
    outputLogForRequest("/stats/pie", result.length);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const bar = async (req, res) => {
  const validatorRes = validator.validate(req.body, barRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  const filters = req.body.filters;
  const groupedBy = req.body.groupedBy;
  try {
    const result = await Pollution.getTotalsByGrouping(db, filters, groupedBy);
    outputLogForRequest("/stats/bar", result.length);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const timeseries = async (req, res) => {
  const validatorRes = validator.validate(req.body, timeSeriesRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  const filters = req.body.filters;
  try {
    const result = {};

    // Query for toxin totals by year for each region
    let index = 0;
    while (index < filters.regions.length) {
      const region = filters.regions[index];
      const filterForSingleProvince = {
        ...req.body.filters,
        regions: [region],
      };
      result[region] = await Pollution.getTotalsByGrouping(
        db,
        filterForSingleProvince,
        ["Year"]
      );
      index++;
    }
    outputLogForRequest("/stats/timeseries", Object.keys(result).length);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

const heatmap = async (req, res) => {
  const validatorRes = validator.validate(req.body, heatmapRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  try {
    const filters = req.body.filters;

    // Only group by region for the heatmap query.
    const result = await Pollution.getTotalsByGrouping(db, filters, ["Region"]);
    outputLogForRequest("/stats/heatmap", result.length);
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

module.exports = {
  pie,
  bar,
  heatmap,
  timeseries,
};
