const assert = require("assert");
const Pollution = require("../models/pollution");
const axios = require("axios");
const mongo = require("../utils/db");

const url = "http://localhost:3000";

const getRequest = (path) => axios.get(url + path);
const postRequest = (path, data) => axios.post(url + path, data);
const deleteRequest = (path) => axios.delete(url + path);
const putRequest = (path, data) => axios.put(url + path, data);

describe("Testing pollution API requests with valid schemas", async function () {
  describe("Testing /stats requests with invalid filters", async function () {});
});
