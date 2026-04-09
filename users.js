const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      String,
  email:     String,
  phone:     String,
  password:  String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// ✅ GET all users — no auth, instant load
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error!', error: err.message });
  }
});

// ✅ DELETE user — no auth
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user!' });
  }
});

module.exports = router;