const assert = require("assert");
const Pollution = require("../models/pollution");
const axios = require("axios");
const mongo = require("../utils/db");
const { stat } = require("fs");

const url = "http://localhost:3000";

const provinces = [
  "ON",
  "QC",
  "NS",
  "NB",
  "MB",
  "BC",
  "PE",
  "SK",
  "AB",
  "NL",
  "NT",
  "YT",
  "NU",
];

const toxins = [
  "TPM",
  "PM10",
  "PM25",
  "SOX",
  "NOX",
  "VOC",
  "CO",
  "NH3",
  "Pb",
  "Cd",
  "Hg",
  "PAH",
];

const getRequest = (path) => axios.get(url + path);
const postRequest = (path, data) => axios.post(url + path, data);
const deleteRequest = (path) => axios.delete(url + path);
const putRequest = (path, data) => axios.put(url + path, data);

async function getPollutionCollection(db) {
  try {
    const collection = await db.collection("pollution");
    return collection;
  } catch (err) {
    throw err;
  }
}

let db;
before(async function () {
  try {
    db = await mongo.connectToDB();
  } catch (err) {
    throw err;
  }
});

after(async function () {
  try {
    mongo.closeDBConnection();
  } catch (err) {
    throw err;
  }
});

describe("Testing the Pollution Stats API", async function () {
  describe("Testing pollution queries - Simple cases", function () {
    it("Success 1 - Test getting all provinces and toxins query", async function () {
      const stats = await Pollution.getFilteredSearchByProvince(db, {
        yearStart: 2001,
        yearEnd: 2018,
        provinces: provinces,
        toxins: toxins,
      });
      provinces.forEach((province) =>
        assert.notStrictEqual(
          stats.find((stat) => stat._id == province),
          undefined
        )
      );
      assert.strictEqual(stats.filter((stat) => stat._id == null).length, 1);
    });
  });
});
