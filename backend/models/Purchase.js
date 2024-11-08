// backend/models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  buyerAddress: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Purchase', purchaseSchema);
