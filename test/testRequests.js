const assert = require("assert");
const Pollution = require("../models/pollution");
const axios = require("axios");
const mongo = require("../utils/db");
const { provinces, toxins, sources } = require("../utils/consts");

const url = "http://localhost:3000";

const getRequest = (path) => axios.get(url + path);
const postRequest = (path, data) => axios.post(url + path, data);
const deleteRequest = (path) => axios.delete(url + path);
const putRequest = (path, data) => axios.put(url + path, data);

describe("Testing pollution API requests with valid schemas", async function () {
  describe("Testing /stats/bar requests", async function () {
    it("Success 1 - Sending request to /stats/bar with year range and grouped by Region", async function () {
      return postRequest("/stats/bar", {
        filters: { yearStart: 2001, yearEnd: 2010 },
        groupedBy: ["Region"],
      }).then((res) => {
        assert.notStrictEqual(res.data.result, undefined);
        provinces.forEach((province) =>
          assert.notStrictEqual(
            res.data.result.find((stat) => stat._id?.Region === province),
            undefined
          )
        );
      });
    });
  });
});
