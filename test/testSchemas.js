/*
  All tests in this section make requests to each endpoint 
  with an improper request body. They make sure the
  error message returned by the server is correct each time.

  All tests return an axios request promise.
  Mocha supports returning of promises.
  https://stackoverflow.com/questions/26571328/how-do-i-properly-test-promises-with-mocha-and-chai
*/

const assert = require("assert");
const axios = require("axios");

const url = "http://localhost:3000";

const postRequest = (path, data) => axios.post(url + path, data);

describe("Testing pollution API requests schema validation failures", async function () {
  describe("Testing /stats/bar requests with invalid filters", async function () {
    it("Fail 1 - Testing /stats/bar with yearEnd and yearStart not integers", async function () {
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
    it("Fail 2 - Testing /stats/bar with invalid region filter parameter", async function () {
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
    it("Fail 3 - Testing /stats/bar with invalid sector in sources filter parameter", async function () {
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
    it("Fail 4 - Testing /stats/bar with invalid grouped by parameter", async function () {
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
    it("Fail 5 - Testing /stats/bar with duplicate region in region parameter", async function () {
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
    it("Fail 6 - Testing /stats/bar with duplicate sector in sector parameter", async function () {
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
    it("Fail 7 - Testing /stats/bar with unexpected parameter", async function () {
      return postRequest("/stats/bar", {
        filters: { comp3100: "web programs" },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.filters,
          'is not allowed to have the additional property "comp3100"'
        );
      });
    });
  });
  describe("Testing /stats/timeseries requests with invalid filters", async function () {
    it("Fail 1 - Testing /stats/timeseries request with unexpected parameter", async function () {
      return postRequest("/stats/timeseries", {
        filters: { test: "test" },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.filters,
          'is not allowed to have the additional property "test"'
        );
      });
    });
    it("Fail 2 - Testing /stats/timeseries request with no filters field", async function () {
      return postRequest("/stats/timeseries", {}).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.instance,
          'requires property "filters"'
        );
      });
    });
    it("Fail 3 - Testing /stats/timeseries request with no region field", async function () {
      return postRequest("/stats/timeseries", { filters: {} }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(res.data.err.filters, 'requires property "regions"');
      });
    });
    it("Fail 4 - Testing /stats/timeseries request with empty region array", async function () {
      return postRequest("/stats/timeseries", {
        filters: { regions: [] },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err["filters.regions"],
          "does not meet minimum length of 1"
        );
      });
    });
    it("Fail 5 - Testing /stats/timeseries request with groupedBy value (not permitted on this endpoint)", async function () {
      return postRequest("/stats/timeseries", {
        groupedBy: ["Year"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.instance,
          'is not allowed to have the additional property "groupedBy"'
        );
      });
    });
  });
  describe("Testing /stats/pie requests with invalid filters", async function () {
    it("Fail 1 - Testing /stats/pie request with unexpected parameter", async function () {
      return postRequest("/stats/pie", {
        filters: { test: "test" },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.filters,
          'is not allowed to have the additional property "test"'
        );
      });
    });
    it("Fail 2 - Testing /stats/pie request with unexped groupedBy value", async function () {
      return postRequest("/stats/pie", {
        groupedBy: ["Source", "Source2"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err["groupedBy[1]"],
          "is not one of enum values: Region,Source,Year"
        );
      });
    });
  });
  describe("Testing /stats/heatmap requests with invalid filters", async function () {
    it("Fail 1 - Testing /stats/heatmap request with unexpected parameter", async function () {
      return postRequest("/stats/heatmap", {
        filters: { test: "test" },
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.filters,
          'is not allowed to have the additional property "test"'
        );
      });
    });
    it("Fail 2 - Testing /stats/timeseries request with groupedBy value (not permitted on this endpoint)", async function () {
      return postRequest("/stats/timeseries", {
        groupedBy: ["Year"],
      }).then((res) => {
        assert.notStrictEqual(res.data.err, undefined);
        assert.strictEqual(
          res.data.err.instance,
          'is not allowed to have the additional property "groupedBy"'
        );
      });
    });
  });
});
