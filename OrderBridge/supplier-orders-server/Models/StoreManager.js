const mongoose = require('mongoose');
const Supplier=require('./Supplier')

const StoreManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'supplier'], required: true }, 
},{ collection: 'admins' });

module.exports = mongoose.model('StoreManager', StoreManagerSchema);
