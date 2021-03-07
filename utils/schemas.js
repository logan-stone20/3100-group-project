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
      uniqueItems: true,
    },
    sources: {
      type: "array",
      items: {
        type: "string",
        enum: sources,
      },
      uniqueItems: true,
    },
  },
  additionalProperties: false,
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
  additionalProperties: false,
};

const heatmapFilterSchema = {
  id: "/heatmapFilterSchema",
  type: "object",
  properties: {
    yearStart: { type: "integer" },
    yearEnd: { type: "integer" },
    sources: {
      type: "array",
      items: {
        type: "string",
        enum: sources,
      },
      uniqueItems: true,
    },
  },
  additionalProperties: false,
};

const heatmapRequestSchema = {
  id: "/heatmapRequestSchema",
  type: "object",
  properties: {
    filters: { $ref: "/heatmapFilterSchema" },
  },
  additionalProperties: false,
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
      minItems: 1,
      uniqueItems: true,
    },
    sources: {
      type: "array",
      items: {
        type: "string",
        enum: sources,
      },
      uniqueItems: true,
    },
  },
  required: ["regions"],
  additionalProperties: false,
};

const timeSeriesRequestSchema = {
  id: "/timeSeriesRequestSchema",
  type: "object",
  properties: {
    filters: { $ref: "/timeSeriesFilterSchema" },
  },
  required: ["filters"],
  additionalProperties: false,
};

const pieRequestSchema = {
  id: "/pieRequestSchema",
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
  additionalProperties: false,
};

validator.addSchema(filterSchema, "/filterSchema");
validator.addSchema(heatmapFilterSchema, "/heatmapFilterSchema");
validator.addSchema(timeSeriesFilterSchema, "/timeSeriesFilterSchema");

module.exports = {
  validator,
  barRequestSchema,
  heatmapRequestSchema,
  timeSeriesRequestSchema,
  pieRequestSchema,
};
