// // const express = require('express');
// // const router = express.Router();
// // const Booking = require('../models/Bookings');

// // // Create booking - POST /api/bookings
// // router.post('/', async (req, res) => {
// //   try {
// //     const booking = await Booking.create(req.body);
// //     res.json({ message: '✅ Booking confirmed', booking });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // Get user bookings - GET /api/bookings/:userId
// // router.get('/:userId', async (req, res) => {
// //   try {
// //     const bookings = await Booking.find({ userId: req.params.userId }).populate('busId');
// //     res.json(bookings);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   userId: String,
//   busId: String,
//   busName: String,
//   from: String,
//   to: String,
//   date: String,
//   seats: { type: Number, default: 1 },
//   totalPrice: Number,
//   status: { type: String, default: 'confirmed' },
//   bookedAt: { type: Date, default: Date.now }
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// // Create booking
// router.post('/', async (req, res) => {
//   try {
//     const booking = await Booking.create(req.body);
//     res.json({ message: '✅ Booking confirmed!', booking });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get user bookings
// router.get('/:userId', async (req, res) => {
//   try {
//     const bookings = await Booking.find({ userId: req.params.userId });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: String,
  busId: String,
  busName: String,
  from: String,
  to: String,
  date: String,
  seats: { type: Number, default: 1 },
  totalPrice: Number,
  status: { type: String, default: 'confirmed' },
  bookedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.json({ message: '✅ Booking confirmed!', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;