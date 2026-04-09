const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Bus     = require('../models/bus');

// ── Auth Middleware ────────────────────────────
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Not admin!' });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token!' });
  }
}

// ────────────────────────────────────────────────
// READ — GET all buses (public)
// ────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Server error!' });
  }
});

// ────────────────────────────────────────────────
// READ — GET single bus by ID
// ────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found!' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: 'Server error!' });
  }
});

// ────────────────────────────────────────────────
// CREATE — POST new bus (Admin only)
// ────────────────────────────────────────────────
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { busName, busNumber, from, to, departure, totalSeats, price } = req.body;

    if (!busName || !busNumber || !from || !to) {
      return res.status(400).json({ message: 'Please fill all required fields!' });
    }

    const bus = new Bus({ busName, busNumber, from, to, departure, totalSeats, price });
    await bus.save();

    res.status(201).json({ message: 'Bus added successfully!', bus });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add bus!' });
  }
});

// ────────────────────────────────────────────────
// UPDATE — PUT update bus by ID (Admin only)
// ────────────────────────────────────────────────
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!bus) return res.status(404).json({ message: 'Bus not found!' });

    res.json({ message: 'Bus updated successfully!', bus });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bus!' });
  }
});

// ────────────────────────────────────────────────
// DELETE — DELETE bus by ID (Admin only)
// ────────────────────────────────────────────────
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found!' });

    res.json({ message: 'Bus deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete bus!' });
  }
});

module.exports = router;