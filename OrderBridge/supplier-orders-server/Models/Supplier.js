const mongoose = require('mongoose');
const Supplier=require('./Supplier')
const Good=require('./Good')

const supplierSchema = new mongoose.Schema({
    representativeName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'supplier'], required: true }, 
   company: { type: String, required: function() { return this.role === 'supplier'; } },
   goods: [
    {
      goodsId: { type: mongoose.Schema.Types.ObjectId, ref: 'Good' }
    }
  ]
});

module.exports = mongoose.model('Supplier', supplierSchema);
