/*
  All tests return an axios request promise.
  Mocha supports returning of promises.
  https://stackoverflow.com/questions/26571328/how-do-i-properly-test-promises-with-mocha-and-chai
*/

const assert = require("assert");
const axios = require("axios");
const { provinces, sources, toxins } = require("../utils/consts");

const url = "http://localhost:3001";

const postRequest = (path, data) => axios.post(url + path, data);

describe("Testing pollution API requests with valid schemas", async function () {
  describe("Testing /stats/pie requets", async function () {
    it("Success 1 - Sending request to /stats/pie with year range and grouped by Region and Source", async function () {
      return postRequest("/stats/pie", {
        filters: {},
        groupedBy: ["Region", "Source"],
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);

        // make sure that data is grouped on region and source
        assert.strictEqual(
          provinces.includes(res.data.result[0]._id.Region),
          true
        );
        assert.strictEqual(
          sources.includes(res.data.result[0]._id.Source),
          true
        );
      });
    });
    it("Success 2 - Sending request to /stats/pie with filter on toxins grouped by Source", async function () {
      return postRequest("/stats/pie", {
        filters: { toxins: ["CO"] },
        groupedBy: ["Source"],
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);

        assert.strictEqual(
          sources.includes(res.data.result[0]._id.Source),
          true
        );
      });
    });
  });
  describe("Testing /stats/heatmap requests", async function () {
    it("Success 1 - Sending request to /stats/heatmap with year range", async function () {
      return postRequest("/stats/heatmap", {
        filters: { yearStart: 2001, yearEnd: 2010 },
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);

        // ensure that data is only grouped on region
        assert.strictEqual(
          provinces.includes(res.data.result[0]._id.Region),
          true
        );
        assert.strictEqual(Object.keys(res.data.result[0]._id).length, 1);
      });
    });
    it("Success 2 - Sending request to /stats/heatmap year start bound and CO toxin only", async function () {
      return postRequest("/stats/heatmap", {
        filters: {yearStart: 2000, toxins: ["CO"]},
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);
        res.data.result.forEach((stat) => assert.notStrictEqual(stat.CO, undefined));
        assert.strictEqual(res.data.result[0].TPM, undefined);
      });
    });
  });

  describe("Testing /stats/bar requests", async function () {
    it("Success 1 - Sending request to /stats/bar with year range and grouped by Region", async function () {
      return postRequest("/stats/bar", {
        filters: { yearStart: 2001, yearEnd: 2010 },
        groupedBy: ["Region"],
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);

        assert.notStrictEqual(res.data.result, undefined);

        // check for presence of each region in result
        provinces.forEach((province) =>
          assert.notStrictEqual(
            res.data.result.find((stat) => stat._id?.Region === province),
            undefined
          )
        );
      });
    });
    it("Success 2 - Sending request to /status/bar with yearStart and grouped by Source", async function () {
      return postRequest("/stats/bar", {
        filters: { yearStart: 2001 },
        groupedBy: ["Source"],
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);

        assert.strictEqual(
          sources.includes(res.data.result[0]._id.Source),
          true
        );
      });
    });
  });

  describe("Testing /stats/timeseries requests", async function () {
    it("Success 1 - Sending a request to /stats/timeseries with region lock", async function () {
      return postRequest("/stats/timeseries", {
        filters: { regions: ["NL"] },
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);
        assert.notStrictEqual(res.data.result.NL, undefined);

        assert.strictEqual(Object.keys(res.data.result.NL[0]._id).length, 1);
      });
    });
    it("Success 2 - Sending a request to /stats/timeseries with region lock source filter", async function () {
      return postRequest("/stats/timeseries", {
        filters: { regions: ["NL"], toxins: ["CO"] },
      }).then((res) => {
        assert.strictEqual(res.data.err, undefined);
        res.data.result.NL.forEach((stat) =>
          assert.strictEqual(stat.CO > 0, true)
        );
        assert.notStrictEqual(res.data.result.NL, undefined);
      });
    });
  });
});
