const mongoose = require('mongoose')
const goodSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    imgUrl:{type:String}
});
module.exports = mongoose.model('Good', goodSchema);