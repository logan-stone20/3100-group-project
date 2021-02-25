const Validator = require("validatorjs");
const client = require("../utils/db.js");

async function _get_pollution_stats_collection(db) {
  try {
    const collection = await db.collection("pollution");
    return collection;
  } catch (err) {
    throw err;
  }
}

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

  isValid() {
    const rules = {
      province: "required|string",
      source: "required|string",
      year: "required|integer",
      TPM: "float",
      PM10: "float",
      PM25: "float",
      SOX: "float",
      NOX: "float",
      VOC: "float",
      NH3: "float",
      Pb: "float",
      Hg: "float",
      Cd: "float",
      PAH: "float",
      PM25: "float",
    };
    const validation = new Validator(this, rules);
    return validation.passes();
  }

  // This function currently just gets total NOX per province
  // to test just run app and look at console :)
  static async getFilteredSearchByProvince(db, filters) {
    return new Promise(async function (resolve, reject) {
      const yearStart = filters.yearStart;
      const yearEnd = filters.yearEnd;
      delete filters.yearStart;
      delete filters.yearEnd;

      const match = {
        $match: {
          Year: {
            $gte: yearStart,
            $lte: yearEnd,
          },
        },
      };
      const group = {
        $group: {
          _id: "$Region",
          NOX: { $sum: "$NOX (t)" },
        },
      };
      try {
        const collection = await _get_pollution_stats_collection(db);
        const result = await collection.aggregate([match, group]).toArray();
        resolve(result);
      } catch (err) {
        reject(
          "There was an error while retrieving your Book. (err:" + err + ")"
        );
      }
    });
  }
}
module.exports = Pollution;
