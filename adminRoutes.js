const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

// Fixed admin credentials (sirf yhi ek admin allowed hai)
const ADMIN_EMAIL = 'busgopro@admin.com';

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("📧 Received email:", email);
  console.log("🔒 Received password:", password);

  const admin = await Admin.findOne({ email });
  console.log("👤 Admin from DB:", admin);

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  console.log("✅ Password match:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ message: "Login Successful", token, admin: { id: admin._id, email: admin.email } });
});

module.exports = router;

//busgopro@admin.com