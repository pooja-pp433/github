const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  from: { type: String },
  to: { type: String },
  date: { type: String },
  seats: { type: Number, default: 1 },
  totalPrice: { type: Number },
  status: { type: String, default: 'confirmed' },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);