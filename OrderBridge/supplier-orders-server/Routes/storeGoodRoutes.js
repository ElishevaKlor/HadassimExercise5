const express = require('express');
const verifyJWT = require("../middleWare/verifyJWT");
const router = express.Router();
const { checkStockAndOrder,createStoreGood,getStoreGoodsByManager } = require('../Controllers/storeGoodController'); 

router.post('/:goodId',verifyJWT, checkStockAndOrder);


router.post('/',verifyJWT, createStoreGood);

router.get('/',verifyJWT,getStoreGoodsByManager)


module.exports = router;
