const Order = require("../Models/Order");
const Supplier = require("../Models/Supplier");
const Good = require("../Models/Good");
const StoreManager=require('../Models/StoreManager')
const OrderStatusEnum = require("../constants/orderStatusEnum");
const StoreGood=require('../Models/StoreGood')
let ioInstance = null;
const setSocketIO = (ioFromServer) => {
  ioInstance = ioFromServer;
};

const createOrder = async (req, res) => {
    try {
        const { supplierId, items } = req.body;
        const { _id } = req.user;
        if (!supplierId || !items || items.length === 0) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        const supplierExists = await Supplier.findById(supplierId);
        if (!supplierExists) {
            return res.status(404).json({ error: true, message: "Supplier not found" });
        }
        let totalAmount = 0;  
        for (const item of items) {
            const good = await Good.findById(item.productId);
            if (!good) {
                return res.status(404).json({ error: true, message: `Good with ID ${item.productId} not found` });
            }
            if (item.quantity < good.minQuantity) {
                return res.status(400).json({
                    error: true,
                    message: `Quantity for Good ID ${item.productId} must be at least ${good.minQuantity}`,
                });
            }
            totalAmount += good.price * item.quantity;
        }
        const updatedItems = items.map(item => {
            return {
                goodsId: item.productId,
                quantity: item.quantity
            };
        });

        const newOrder = new Order({ 
            supplierId, 
            items: updatedItems,
            storeManagerId: _id,
            totalAmount  
        });
        await newOrder.save();
        if (res) {
            return res.status(201).json({ error: false, message: "Order created successfully", order: newOrder });
        }
        if (ioInstance) {
            ioInstance.emit('order-added', `הזמנה הגיעה מלקוח ${_id}`);
          }

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


const getOrders = async (req, res) => {
    try {
        const storeManagerId = req.user?._id; 
        if (!storeManagerId) {
            return res.status(401).json({ error: true, message: "Unauthorized - Missing store manager ID" });
        }
        const orders = await Order.find({ storeManagerId }) 
            .populate("supplierId")
            .populate("items.goodsId")
        res.json({ error: false, orders });
        
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};
const getOrdersBySupplier = async (req, res) => {
    try {
        const supplierId = req.user?._id; 
        if (!supplierId) {
            return res.status(401).json({ error: true, message: "Unauthorized - Missing store manager ID" });
        }
        const order = await Order.findOne().populate("storeManagerId");
        const orders = await Order.find({ supplierId }) 
            .populate("supplierId")
            .populate("items.goodsId")
            .populate("storeManagerId");
        res.json({ error: false, orders });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status, orderId } = req.body;
        const { role } = req.user;
        const validStatuses = Object.values(OrderStatusEnum).map(s => s.key);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "סטטוס לא תקין" });
        }
        if (role === "supplier" && status === OrderStatusEnum.COMPLETED.key) {
            return res.status(403).json({ error: true, message: "Suppliers cannot mark orders as completed" });
        }
        if (role === "storeManager" && status === OrderStatusEnum.WAITING.key) {
            return res.status(403).json({ error: true, message: "Admins cannot revert orders to waiting" });
        }
        const order = await Order.findById(orderId)
            .populate('items.goodsId');
        if (!order) {
            return res.status(404).json({ error: true, message: "Order not found" });
        }

        order.status = status;
        await order.save();
        if (role === "storeManager"&&ioInstance) {
            ioInstance.emit('order-completed', {
                orderId: order._id,
                message: `הזמנה מספר ${order._id} הגיעה ליעדה ללקוח ${req.user._id}`
            });
        }
        if (order.status === 'completed') {
            const storeGood = await StoreGood.findOne({ productName: order.items[0].goodsId.productName });
            if (!storeGood) {
                return res.status(404).json({ message: 'StoreGood not found' });
            }
    
            storeGood.currentQuantity += order.items[0].quantity;
            await storeGood.save();
        }
        res.json({ error: false, message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};








module.exports = { createOrder, getOrders, updateOrderStatus ,getOrdersBySupplier,setSocketIO};