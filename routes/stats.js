const express = require("express");
const stats_controller = require("../controllers/stats.js");

const router = express.Router();

router.post("/pie", stats_controller.pie);
router.post("/heatmap", stats_controller.heatmap);
router.post("/bar", stats_controller.bar);
router.post("/timeseries", stats_controller.timeseries);

module.exports = router;
