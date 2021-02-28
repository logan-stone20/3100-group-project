const Pollution = require("../models/pollution.js");
const Validator = require("jsonschema").Validator;
const { provinces, sources } = require("../utils/consts");

const validator = new Validator();

// To determine what data each endpoint needs, take a look at
// the jsFiddles provided in the highcharts website demos!

const filterSchema = {
  id: "/filterSchema",
  type: "object",
  yearStart: { type: "number" },
  yearEnd: { type: "number" },
  regions: {
    type: "array",
    contains: {
      type: "string",
      enum: provinces,
    },
  },
  sectors: {
    type: "array",
    items: {
      type: "string",
      enum: sources,
    },
  },
};

const requestSchema = {
  id: "/requestSchema",
  type: "object",
  properties: {
    filters: { $ref: "/filterSchema" },
    groupedBy: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        enum: ["Region", "Source", "Year"],
      },
    },
  },
};

validator.addSchema(filterSchema, "/filterSchema");

const formatValidationError = (validationInstance) => {
  return {
    err: `${validationInstance.instance} ${validationInstance.message}`,
  };
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
  const validatorRes = validator.validate(req.body, requestSchema);
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
  For this one I was thinking maybe perform two queries,
  one for each province over the given time frame.
*/
const timeseries = async (req, res) => {
  const validatorRes = validator.validate(req.body, requestSchema);
  if (!validatorRes.valid) {
    res.send(formatValidationError(validatorRes));
    return;
  }
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
const heatmap = async (req, res) => {
  const validatorRes = validator.validate(req.body, requestSchema);
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
