const assert = require("assert");
const Pollution = require("../models/pollution");
const axios = require("axios");
const mongo = require("../utils/db");
const { provinces, toxins, sources } = require("../utils/consts");

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
    it("Success 1 - Test get all toxins totals by region query with no filters", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Region"]);

      provinces.forEach((province) =>
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Region == province),
          undefined
        )
      );
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
      assert.strictEqual(stats.filter((stat) => stat._id == null).length, 1);
    });
    it("Success 2 - Test get all toxins totals by year query", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Year"]);
      assert.strictEqual(stats[0]._id.Year, 1990);
      assert.strictEqual(stats[stats.length - 2]._id.Year, 2018);

      // Make sure totals over all years is included
      assert.strictEqual(stats[stats.length - 1]._id, null);
    });
    it("Success 3 - Test get all toxins totals by year query with lower bound on year", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { yearStart: 2000 },
        ["Year"]
      );
      assert.strictEqual(stats[0]._id.Year, 2000);
      assert.strictEqual(stats[stats.length - 2]._id.Year, 2018);

      let year = 2000;
      while (year <= 2018) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year++;
      }

      // Make sure totals over all years is included
      assert.strictEqual(stats[stats.length - 1]._id, null);
    });
    it("Success 4 - Test get all toxins totals by year query with upper bound on year", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, { yearEnd: 2000 }, [
        "Year",
      ]);

      let year = 2000;
      while (year >= 1990) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year--;
      }

      // stats.length - 2 because year range is inclusive and
      // results contains a object containing totals over all years.
      assert.strictEqual(10, stats.length - 2);

      // Make sure totals over all years is included
      assert.strictEqual(stats[stats.length - 1]._id, null);
    });
    it("Success 5 - Test get all toxins totals by year query with both bounds on year", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { yearStart: 1997, yearEnd: 2010 },
        ["Year"]
      );

      assert.strictEqual(13, stats.length - 2);

      let year = 2010;
      while (year >= 1997) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year--;
      }

      // Make sure totals over all years is included
      assert.strictEqual(stats[stats.length - 1]._id, null);
    });
    it("Success 6 - Test get all toxins totals by source query with no filters", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Source"]);

      sources.forEach((source) => {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Source === source),
          undefined
        );
      });
    });
    it("Success 7 - Test get all toxins totals grouped by source and province query with no filters", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, [
        "Region",
        "Source",
      ]);

      provinces.forEach((province) => {
        sources.forEach((source) => {
          assert.notStrictEqual(
            stats.find(
              (stat) =>
                stat._id.Region === province && stat._id.Source === source
            ),
            undefined
          );
        });
        assert.notStrictEqual(
          stats.find(
            (stat) =>
              stat._id.Region === province && stat._id.Source === "GRAND TOTAL"
          ),
          undefined
        );
      });
    });
  });
});
