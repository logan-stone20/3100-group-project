const express = require("express");
const stats_router = require("./routes/stats.js");
const mongo = require("./utils/db.js");
const port = 3000;
const Pollution = require("./models/pollution.js");

var db;
async function loadDBClient() {
  try {
    db = await mongo.connectToDB();
    console.log(
      await Pollution.getFilteredSearchByProvince(db, {
        yearStart: 1994,
        yearEnd: 2001,
        provinces: ["NL", "NS"],
        toxins: ["NOX", "SOX", "Pb", "VOC"],
      })
    );
  } catch (err) {
    console.log(err);
    throw new Error("Could not connect to the Mongo DB");
  }
}
loadDBClient();

const app = express();

app.use(express.json());

app.use("/stats", stats_router);

server = app.listen(port, async () => {
  console.log("Example app listening at http://localhost:%d", port);
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  console.log("Closing Mongo Client.");
  mongo.closeDBConnection();
  server.close(() => {
    console.log("Http server closed.");
  });
});
