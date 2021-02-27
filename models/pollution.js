const Validator = require("validatorjs");
const client = require("../utils/db.js");
const { columnToMongo, pollution, toxins } = require("../utils/consts.js");

async function _get_pollution_stats_collection(db) {
  try {
    const collection = await db.collection("pollution");
    return collection;
  } catch (err) {
    throw err;
  }
}

const groupedByToMongo = {
  year: "$Year",
  region: "$Region",
  source: "$Source",
};

class Pollution {
  constructor(
    province,
    year,
    source,
    TPM,
    PM10,
    PM25,
    SOX,
    NOX,
    VOC,
    CO,
    NH3,
    Pb,
    Cd,
    Hg,
    PAH
  ) {
    this.province = province;
    this.year = year;
    this.source = source;
    this.TPM = TPM;
    this.PM10 = PM10;
    this.PM25 = PM25;
    this.SOX = SOX;
    this.NOX = NOX;
    this.VOC = VOC;
    this.CO = CO;
    this.NH3 = NH3;
    this.Pb = Pb;
    this.Hg = Hg;
    this.Cd = Cd;
    this.PAH = PAH;
  }

  /* 
    Gets total pollutions per provice or region (specified by groupedBy). All results will have an
     _id field that is equal to the province code. There is an entry that
     has _id = null which specifies totals across all provinces. 
  */

  // groupedBy is gonna have to become a list to become a list
  // since we want to have multi level pie charts with provinces and
  // their sectors
  static async getTotalsByGrouping(db, filters, groupedBy) {
    return new Promise(async function (resolve, reject) {
      try {
        const yearStart = filters.yearStart;
        const yearEnd = filters.yearEnd;
        delete filters.yearStart;
        delete filters.yearEnd;

        const match = {
          $match: {},
        };

        if (yearStart || yearEnd) {
          match.$match.Year = {};
          if (yearStart) {
            match.$match.Year.$gte = yearStart;
          }
          if (yearEnd) {
            match.$match.Year.$lte = yearEnd;
          }
        }

        if (filters.provinces) {
          match.$match.Region = { $in: filters.provinces };
        }

        if (filters.sectors) {
          match.$match.Source = { $in: filters.sectors };
        }

        const group = {
          $group: {},
        };

        group.$group._id = groupedByToMongo[groupedBy];

        if (filters.toxins) {
          filters.toxins.forEach((key) => {
            group.$group[key] = { $sum: columnToMongo[key] };
          });
        } else {
          toxins.forEach((key) => {
            group.$group[key] = { $sum: columnToMongo[key] };
          });
        }

        // All queries sorted in ascending order by _id
        const sort = { $sort: { _id: 1 } };
        const collection = await _get_pollution_stats_collection(db);
        const result = await collection
          .aggregate([match, group, sort])
          .toArray();

        // setting _id to null will get us an object totals over all years/regions
        // grand total is already included in the source query
        if (groupedBy !== "source") {
          group.$group._id = null;
          const totals = await collection
            .aggregate([match, group, sort])
            .toArray();

          result.push(totals[0]);
        }

        resolve(result);
      } catch (err) {
        reject(
          "There was an error while retrieving pollution data (err:" + err + ")"
        );
      }
    });
  }
}

module.exports = Pollution;
