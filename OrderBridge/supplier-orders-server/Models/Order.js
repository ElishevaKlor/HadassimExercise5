const mongoose = require('mongoose')
const Supplier=require('./Supplier')
const Good=require('./Good')
const StoreManager=require('./StoreManager')
const OrderStatusEnum = require('../constants/orderStatusEnum');
const orderSchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: Object.values(OrderStatusEnum).map(status => status.key), 
    default: OrderStatusEnum.WAITING.key 
},
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    storeManagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreManager', required: true },
    items: [
      {
        goodsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Good', required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  },{timestamps:true});
  
  module.exports = mongoose.model('Order', orderSchema);