const express = require("express");
const router = express.Router();
const { addStoreManager } = require("../Controllers/StoreManagerController");

router.post("/", addStoreManager);

module.exports = router;
