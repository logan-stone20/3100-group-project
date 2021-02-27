const express = require("express");
const stats_controller = require("../controllers/stats.js");

const router = express.Router();

router.get("/pie", stats_controller.pie);
router.get("/heatmap", stats_controller.heatmap);
router.get("/bar", stats_controller.bar);
router.get("/timeseries", stats_controller.timeseries);

module.exports = router;
