const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleWare/verifyJWT");
const verifyAdmin=require('../middleWare/verifyAdmin')
const verifySupplier=require('../middleWare/verifySupplier')
const verifyUserOrAdmin=require('../middleWare/verifySupplierOrStoreManager')
const { createOrder, getOrders, getOrdersBySupplier, updateOrderStatus } = require("../Controllers/orderController");

const OrderStatusEnum = require("../constants/orderStatusEnum");
router.get('/order-statuses', verifyJWT, verifyUserOrAdmin, (req, res) => {
    console.log("get statuses");
    res.json(Object.values(OrderStatusEnum)); 
});

router.post("/", verifyJWT,verifyAdmin, createOrder);
router.get("/", verifyJWT,verifyAdmin, getOrders);
router.get("/supplier", verifyJWT,verifySupplier, getOrdersBySupplier);
router.put("/", verifyJWT,verifyUserOrAdmin, updateOrderStatus);

module.exports = router;
