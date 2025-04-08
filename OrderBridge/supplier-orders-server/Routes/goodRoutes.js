const express = require('express');
const verifyJWT = require("../middleWare/verifyJWT");
const router = express.Router();
const { addGoods } = require('../Controllers/goodsController'); 
const verifySupplier=require('../middleWare/verifySupplier')

router.post('/',verifyJWT,verifySupplier, addGoods);

module.exports = router;
