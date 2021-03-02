const assert = require("assert");
const axios = require("axios");
const { provinces, sources } = require("../utils/consts");

const url = "http://localhost:3000";

const postRequest = (path, data) => axios.post(url + path, data);

describe("Testing pollution API requests with valid schemas", async function () {
  describe("Testing /stats/bar requests", async function () {
    it("Success 1 - Sending request to /stats/bar with year range and grouped by Region", async function () {
      return postRequest("/stats/bar", {
        filters: { yearStart: 2001, yearEnd: 2010 },
        groupedBy: ["Region"],
      }).then((res) => {
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
    it("Success 2 - Sending request to /stats/pie with year range and grouped by Region and Source", async function () {
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
    it("Success 3 - Sending request to /stats/heatmap with year range", async function () {
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
  });
});
