const assert = require("assert");
const Pollution = require("../models/pollution");
const axios = require("axios");
const mongo = require("../utils/db");

const url = "http://localhost:3000";

const getRequest = (path) => axios.get(url + path);
const postRequest = (path, data) => axios.post(url + path, data);
const deleteRequest = (path) => axios.delete(url + path);
const putRequest = (path, data) => axios.put(url + path, data);

describe("Testing pollution API requests schema validation", async function () {
  describe("Testing /stats requests with invalid filters", async function () {
    it("Fail 1 - Testing request with yearEnd and yearStart not integers", async function () {
      return postRequest("/stats/bar", {
        filters: { yearEnd: "s", yearStart: "x" },
        groupedBy: ["Region"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 2);
        assert.strictEqual(
          res.data.err["filters.yearStart"],
          "is not of a type(s) integer"
        );
        assert.strictEqual(
          res.data.err["filters.yearEnd"],
          "is not of a type(s) integer"
        );
      });
    });
    it("Fail 2 - Testing request with invalid region filter parameter", async function () {
      return postRequest("/stats/bar", {
        filters: { regions: ["notInCanada"] },
        groupedBy: ["Region"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err["filters.regions[0]"],
          "is not one of enum values: ON,QC,NS,NB,MB,BC,PE,SK,AB,NL,NT,YT,NU"
        );
      });
    });
    it("Fail 3 - Testing request with invalid sector in sources filter parameter", async function () {
      return postRequest("/stats/bar", {
        filters: { sources: ["notASector"] },
        groupedBy: ["Region"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err["filters.sources[0]"].includes(
            "is not one of enum values"
          ),
          true
        );
      });
    });
    it("Fail 4 - Testing request with invalid grouped by parameter", async function () {
      return postRequest("/stats/bar", {
        groupedBy: ["invalidValue"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 1);
        assert.strictEqual(
          res.data.err["groupedBy[0]"],
          "is not one of enum values: Region,Source,Year"
        );
      });
    });
    it("Fail 5 - Testing request with duplicate region in region parameter", async function () {
      return postRequest("/stats/bar", {
        filters: { regions: ["NL", "NL"] },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 1);
        assert.strictEqual(
          res.data.err["filters.regions"],
          "contains duplicate item"
        );
      });
    });
    it("Fail 6 - Testing request with duplicate sector in sector parameter", async function () {
      return postRequest("/stats/bar", {
        filters: { sources: ["Manufacturing", "Manufacturing"] },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 1);
        assert.strictEqual(
          res.data.err["filters.sources"],
          "contains duplicate item"
        );
      });
    });
    it("Fail 7 - Testing timeseries request without filters parameter", async function () {
      return postRequest("/stats/timeseries", {}).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 1);
        assert.strictEqual(
          res.data.err.instance,
          'requires property "filters"'
        );
      });
    });
    it("Fail 8 - Testing timeseries request without filters.regions parameter", async function () {
      return postRequest("/stats/timeseries", { filters: {} }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(Object.keys(res.data.err).length, 1);
        assert.strictEqual(res.data.err.filters, 'requires property "regions"');
      });
    });
  });
});
