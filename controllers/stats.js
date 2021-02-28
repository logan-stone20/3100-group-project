const Pollution = require("../models/pollution.js");
const {
  validator,
  barRequestSchema,
  heatmapRequestSchema,
  timeSeriesRequestSchema,
} = require("../utils/schemas");

const formatValidationError = (validationInstance) => {
  const errObj = { err: {} };
  validationInstance.errors.forEach((err) => {
    const property = err.property.replace("instance.", "");
    errObj.err[property] = err.message;
  });
  return errObj;
};

const pie = async (req, res) => {
  const validatorRes = validator.validate(req.body, requestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  try {
    const result = await Pollution.getPieData(db, req);
    res.send(result);
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
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

/*
  For this one I was thinking maybe perform multiple queries,
  one for each province over the given time frame.
*/
const timeseries = async (req, res) => {
  const validatorRes = validator.validate(req.body, timeSeriesRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
  let db = req.db;
  const filters = req.body.filters;
  try {
    const result = {}
    filters.regions.forEach((region) => {
      const filterForSingleProvince = {...req.body.filters, regions: [region]}
      result[region] = await Pollution.getTotalsByGrouping(db, filterForSingleProvince, ["year"]);
    })
    res.send({ result: result });
  } catch (err) {
    res.send("There was an error  (err:" + err + ")");
  }
};

// Pretty sure heat map can just use the same info as the bar function
const heatmap = async (req, res) => {
  const validatorRes = validator.validate(req.body, heatmapRequestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
};

module.exports = {
  pie,
  bar,
  heatmap,
  timeseries,
};
