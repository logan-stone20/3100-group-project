const express = require("express");
const stats_router = require("./routes/stats.js");
const mongo = require("./utils/db.js");
const port = 3000;
const Pollution = require("./models/pollution.js");

var db;
async function loadDBClient() {
  try {
    db = await mongo.connectToDB();
    // Returns a promise that will resolve to the list of the collections

    console.log(
      await Pollution.getFilteredSearch(db, { yearStart: 2000, yearEnd: 2015 })
    );
  } catch (err) {
    throw new Error("Could not connect to the Mongo DB");
  }
}
loadDBClient();

const app = express();

app.use(express.json());

app.use("/stats", stats_router);

server = app.listen(port, () => {
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
