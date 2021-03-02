const { columnToMongo, toxins } = require("../utils/consts.js");

async function _get_pollution_stats_collection(db) {
  const collection = await db.collection("pollution");
  return collection;
}

const groupedByToMongo = {
  Year: "$Year",
  Region: "$Region",
  Source: "$Source",
};

class Pollution {
  constructor(
    region,
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
    this.region = region;
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
  static async getTotalsByGrouping(db, filters, groupedByList) {
    return new Promise(async function (resolve, reject) {
      try {
        const yearStart = filters?.yearStart;
        const yearEnd = filters?.yearEnd;

        const match = {
          $match: {},
        };

        // the following will construct an array of [match, group, sort] objects
        // which are required for the mongodb aggregate() function
        if (yearStart || yearEnd) {
          match.$match.Year = {};
          if (yearStart) {
            match.$match.Year.$gte = yearStart;
          }
          if (yearEnd) {
            match.$match.Year.$lte = yearEnd;
          }
        }

        if (filters?.regions) {
          match.$match.Region = { $in: filters.regions };
        }

        if (filters?.sources) {
          match.$match.Source = { $in: filters.sources };
        }

        const group = {
          $group: {},
        };

        group.$group._id = groupedByList ? {} : null;

        groupedByList?.forEach((column) => {
          group.$group._id[column] = groupedByToMongo[column];
        });

        if (filters?.toxins) {
          filters.toxins.forEach((key) => {
            group.$group[key] = { $sum: columnToMongo[key] };
          });
        } else {
          // get all toxins if none are specified in filters
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
        if (!groupedByList?.includes("Sector")) {
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
