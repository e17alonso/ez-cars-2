// backend/models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  mileage: { type: String, required: true },
  price: { type: String, required: true }, // Precio en PD
  sellerAddress: { type: String, required: true },
  sold: { type: Boolean, default: false },
});

module.exports = mongoose.model('Car', carSchema);
