/*
  This file tests model functions we have written in models/pollution.js
*/

const assert = require("assert");
const Pollution = require("../models/pollution");
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
  describe("Testing pollution queries - Simple cases - no filters", function () {
    it("Success 1 - Test get all toxins totals by region with no filters for all years and regions", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Region"]);

      // Make sure all regions are present in result.
      provinces.forEach((province) =>
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Region == province),
          undefined
        )
      );

      // Make sure all toxins are present in result.
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });

    it("Success 2 - Test get all toxins totals by year query for all years", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Year"]);
      assert.strictEqual(stats[0]._id.Year, 1990);
      assert.strictEqual(stats[stats.length - 1]._id.Year, 2018);
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });

    it("Success 3 - Test get all toxins totals by source query with no filters", async function () {
      const stats = await Pollution.getTotalsByGrouping(db, {}, ["Source"]);

      sources.forEach((source) => {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Source === source),
          undefined
        );
      });
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 4 - Test get all toxins totals grouped by source and province query with no filters", async function () {
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
      });

      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 5 - Test creation of a valid pollution entry with parameter matching", async function () {
      let region = "ON";
      let year = 1994;
      let source = "Ore and Mineral Industries";
      let tpm = 66998.36036;
      let pm10 = 33464.0134;
      let pm25 = 20887.60176;
      let sox = 313595.9671;
      let nox = 41847.71466;
      let voc = 8262.18732;
      let co = 87620.08829;
      let nh3 = 1240.049868;
      let pb = 91399.34374;
      let cd = 1749.546597;
      let hg = 619.8704574;
      let pah = 2.572273851;
      let testPollution = new Pollution(region, year, source, tpm, pm10, pm25, sox, nox, voc, co, nh3, pb, cd, hg, pah);
      assert.strictEqual(testPollution.region, "ON");
      assert.strictEqual(testPollution.year, 1994);
      assert.strictEqual(testPollution.source, "Ore and Mineral Industries");
      assert.strictEqual(testPollution.TPM, 66998.36036);
      assert.strictEqual(testPollution.PM10, 33464.0134);
      assert.strictEqual(testPollution.PM25, 20887.60176);
      assert.strictEqual(testPollution.SOX, 313595.9671);
      assert.strictEqual(testPollution.NOX, 41847.71466);
      assert.strictEqual(testPollution.VOC, 8262.18732);
      assert.strictEqual(testPollution.CO, 87620.08829);
      assert.strictEqual(testPollution.NH3, 1240.049868);
      assert.strictEqual(testPollution.Pb, 91399.34374);
      assert.strictEqual(testPollution.Cd, 1749.546597);
      assert.strictEqual(testPollution.Hg, 619.8704574);
      assert.strictEqual(testPollution.PAH, 2.572273851);
    });
  });
  describe("Testing pollution queries - Simple cases - one filter applied", function () {
    it("Success 1 - Test get all toxins totals by region with no filters for all years and one region", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { regions: ["NL"] },
        ["Region"]
      );

      assert.strictEqual(stats.length, 1);
      assert.strictEqual(stats[0]._id.Region, "NL");
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 2 - Test get toxins totals with filter on toxins", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { toxins: ["CO"] },
        ["Region", "Source"]
      );

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
      });

      ["CO"].forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 3 - Test get all toxins totals by year query with upper bound on year", async function () {
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

      // there should be 11 years in the results since data starts at 1990 (yearEnd is inclusive)
      assert.strictEqual(11, stats.length);
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 4 - Test get all toxins totals by year query with lower bound on year", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { yearStart: 2000 },
        ["Year"]
      );
      assert.strictEqual(stats[0]._id.Year, 2000);
      assert.strictEqual(stats[stats.length - 1]._id.Year, 2018);

      let year = 2000;
      while (year <= 2018) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year++;
      }
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 5 - Test get all toxins totals by year query with both bounds on year", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { yearStart: 1997, yearEnd: 2010 },
        ["Year"]
      );

      assert.strictEqual(13, stats.length - 1);

      // Make sure proper years are present in result
      let year = 2010;
      while (year >= 1997) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year--;
      }
    });
    it("Success 6 - Test get all toxins totals by year query for a single year", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        { yearStart: 2010, yearEnd: 2010 },
        ["Year"]
      );
      assert.strictEqual(stats[0]._id.Year, 2010);
      assert.strictEqual(stats.length, 1);
      toxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
  });

  describe("Testing pollution queries - Complex cases - two or more filters applied", function () {
    const filteredProvinces = ["NL", "NS"];
    const filteredToxins = ["CO", "SOX"];
    const filteredSources = ["Fires", "Manufacturing"];
    const yearStart = 1990;
    const yearEnd = 2000;
    it("Success 1 - Test get toxins totals by region with all filters applied", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        {
          toxins: filteredToxins,
          regions: filteredProvinces,
          sources: filteredSources,
          yearStart: yearStart,
          yearEnd: yearEnd,
        },
        ["Region"]
      );

      // make sure only filtered provinces are present
      assert.strictEqual(stats.length, 2);
      filteredProvinces.forEach((province) => {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Region === province),
          undefined
        );
      });
      filteredToxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 2 - Test get toxins totals by source with all filters applied", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        {
          toxins: filteredToxins,
          regions: filteredProvinces,
          sources: filteredSources,
          yearStart: yearStart,
          yearEnd: yearEnd,
        },
        ["Source"]
      );

      // make sure only filtered sources are present
      assert.strictEqual(stats.length, 2);
      filteredSources.forEach((source) => {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Source === source),
          undefined
        );
      });
      filteredToxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
    it("Success 3 - Test get toxins totals by year with all filters applied", async function () {
      const stats = await Pollution.getTotalsByGrouping(
        db,
        {
          toxins: filteredToxins,
          regions: filteredProvinces,
          sources: filteredSources,
          yearStart: yearStart,
          yearEnd: yearEnd,
        },
        ["Year"]
      );

      //  yearEnd - yearStart + 1 because year range is inclusive
      assert.strictEqual(stats.length, yearEnd - yearStart + 1);

      let year = yearStart;
      while (year <= yearEnd) {
        assert.notStrictEqual(
          stats.find((stat) => stat._id.Year === year),
          undefined
        );
        year++;
      }

      filteredToxins.forEach((toxin) =>
        assert.notStrictEqual(stats[0][toxin], undefined)
      );
    });
  });
});
