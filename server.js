const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));

app.use(express.json());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

/* ================================
   📦 Models
================================ */
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

const busSchema = new mongoose.Schema({
  busName:    String,
  busNumber:  String,
  type:       String,
  from:       String,
  to:         String,
  departure:  String,
  arrival:    String,
  price:      Number,
  totalSeats: Number,
  rating:     Number
});
const Bus = mongoose.models.Bus || mongoose.model("Bus", busSchema);

const bookingSchema = new mongoose.Schema({
  userId:        String,
  userName:      String,
  userEmail:     String,
  userPhone:     String,
  busId:         String,
  busName:       String,
  busOperator:   String,
  busType:       String,
  from:          String,
  to:            String,
  date:          String,
  departure:     String,
  arrival:       String,
  seats:         Number,
  selectedSeats: Array,
  passengers:    Array,
  basePrice:     Number,
  taxes:         Number,
  totalPrice:    Number,
  paymentMethod: String,
  bookingId:     String,
  status:        { type: String, default: 'confirmed' },
  cancelledAt:   Date,
  refundAmount:  Number,
  refundStatus:  { type: String, default: '' },
  bookedAt:      Date,
  createdAt:     { type: Date, default: Date.now }
});
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

/* ================================
   AUTH ROUTES
================================ */
app.post('/api/auth/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered!" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error!", error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong Password!" });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

/* ================================
   🚌 BUS ROUTES
================================ */
app.get('/api/buses', async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};
    if (from) query.from = { $regex: from, $options: 'i' };
    if (to)   query.to   = { $regex: to,   $options: 'i' };
    const buses = await Bus.find(query);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

app.get('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

app.post('/api/buses', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.json({ message: "Bus added!", bus });
  } catch (err) {
    res.status(500).json({ message: "Failed to add bus!" });
  }
});

app.put('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: "Bus not found!" });
    res.json({ message: "Bus updated!", bus });
  } catch (err) {
    res.status(500).json({ message: "Failed to update bus!" });
  }
});

app.delete('/api/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found!" });
    res.json({ message: "Bus deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete bus!" });
  }
});

/* ================================
   🎫 BOOKING ROUTES
================================ */

// GET all bookings (Admin)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

// GET bookings by userId
app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error!" });
  }
});

// ✅ GET booked seats for a specific bus + date
// Usage: GET /api/bookings/booked-seats?busId=xxx&date=2026-03-20
app.get('/api/bookings/booked-seats', async (req, res) => {
  try {
    const { busId, date } = req.query;
    if (!busId || !date) {
      return res.status(400).json({ message: "busId and date required!" });
    }

    // Find all CONFIRMED bookings for this bus on this date
    const bookings = await Booking.find({
      busId: busId,
      date: date,
      status: 'confirmed'
    });

    // Collect all booked seat numbers
    const bookedSeats = [];
    bookings.forEach(b => {
      if (b.selectedSeats && Array.isArray(b.selectedSeats)) {
        b.selectedSeats.forEach(seat => bookedSeats.push(seat));
      }
    });

    res.json({ bookedSeats });
  } catch (err) {
    console.error('Booked seats error:', err);
    res.status(500).json({ message: "Server error!" });
  }
});

// POST new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking confirmed!", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed!" });
  }
});

// CANCEL booking
app.put('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: "Already cancelled!" });
    }

    const journeyDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((journeyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let refundPercent = 0;
    let refundMsg = '';
    if (daysLeft >= 3) { refundPercent = 100; refundMsg = '100% refund (3+ days before journey)'; }
    else if (daysLeft >= 1) { refundPercent = 50; refundMsg = '50% refund (1-2 days before journey)'; }
    else { refundPercent = 0; refundMsg = 'No refund (same day cancellation)'; }

    const refundAmount = Math.round((booking.totalPrice * refundPercent) / 100);
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? 'initiated' : 'none';
    await booking.save();

    res.json({ message: "Booking cancelled!", refundAmount, refundPercent, refundMsg, booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel!" });
  }
});

/* ================================
   Admin Routes
================================ */
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const usersRoute = require("./routes/users");
app.use("/api/users", usersRoute);

app.get('/', (req, res) => {
  res.json({ message: '✅ BusGoPro API Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));