const express = require("express");
const mongo = require("./utils/db");
const port = 3000;

var db;
async function loadDBClient() {
  try {
    db = await mongo.connectToDB();
  } catch (err) {
    throw new Error("Could not connect to the Mongo DB");
  }
}
loadDBClient();

const app = express();

app.use(express.json());

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
