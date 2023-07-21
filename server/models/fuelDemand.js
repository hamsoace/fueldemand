// models/fuelDemand.js
const mongoose = require('mongoose');

const fuelDemandSchema = new mongoose.Schema({
  fuel_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  current_stock: { type: Number, default: 0 }, // Add a field to store the current stock
});

module.exports = mongoose.model('FuelDemand', fuelDemandSchema);
