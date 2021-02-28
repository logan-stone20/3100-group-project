const Validator = require("jsonschema").Validator;
const { provinces, sources } = require("../utils/consts");

const validator = new Validator();

// To determine what data each endpoint needs, take a look at
// the jsFiddles provided in the highcharts website demos!

const filterSchema = {
  id: "/filterSchema",
  type: "object",
  properties: {
    yearStart: { type: "integer" },
    yearEnd: { type: "integer" },
    regions: {
      type: "array",
      items: {
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
  },
};

const barRequestSchema = {
  id: "/barRequestSchema",
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

const heatmapRequestSchema = {
  id: "/heatmapRequestSchema",
  type: "object",
  properties: {
    filters: { $ref: "/filterSchema" },
  },
};

const timeSeriesFilterSchema = {
  id: "/timeSeriesFilterSchema",
  type: "object",
  properties: {
    yearStart: { type: "integer" },
    yearEnd: { type: "integer" },
    regions: {
      type: "array",
      items: {
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
  },
  required: ["regions"],
};

const timeSeriesRequestSchema = {
  id: "/timeSeriesRequestSchema",
  type: "object",
  properties: {
    filters: { $ref: "/timeSeriesFilterSchema" },
  },
};

validator.addSchema(filterSchema, "/filterSchema");
validator.addSchema(timeSeriesFilterSchema, "/timeSeriesFilterSchema");

module.exports = {
  validator,
  barRequestSchema,
  heatmapRequestSchema,
  timeSeriesRequestSchema,
};
