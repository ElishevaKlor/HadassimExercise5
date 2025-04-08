const express = require("express");
const router = express.Router();
const verifyAdmin=require('../middleWare/verifyAdmin')
const verifyJWT=require('../middleWare/verifyJWT')
const { addSupplier,getAllSuppliers,getSupplierGoods } = require("../Controllers/SupplierController");

router.post("/", addSupplier);
router.get("/",verifyJWT,verifyAdmin,getAllSuppliers);
router.get('/:supplierId',verifyJWT, getSupplierGoods);

module.exports = router;