const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  // ✅ Admin CRUD fields
  busName:    { type: String },
  busNumber:  { type: String },
  totalSeats: { type: Number, default: 40 },

  // ✅ Old fields (purana data compatible)
  name:       { type: String },
  operator:   { type: String },
  type:       { type: String },
  seats:      { type: Number },
  rating:     { type: Number },
  arrival:    { type: String },

  // ✅ Common fields
  from:       { type: String },
  to:         { type: String },
  departure:  { type: String },
  price:      { type: Number, default: 0 },

}, { timestamps: true });

// ✅ mongoose.models check — OverwriteModelError fix
module.exports = mongoose.models.Bus || mongoose.model('Bus', busSchema);