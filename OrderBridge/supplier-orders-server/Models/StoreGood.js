const mongoose = require('mongoose')
const Supplier=require('./Supplier')
const StoreManager=require('../Models/StoreManager')
const storeGoodSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    currentQuantity:{type:Number,required:true},
    storeManager: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreManager' }
});
module.exports = mongoose.model('StoreGood', storeGoodSchema);