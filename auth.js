// // const express = require('express');
// // const router = express.Router();
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const User = require('../models/user');

// // // REGISTER
// // router.post('/register', async (req, res) => {
// //   try {
// //     const { name, email, password, phone } = req.body;
// //     const exists = await User.findOne({ email });
// //     if (exists) return res.status(400).json({ message: 'Email already exists' });

// //     const hashed = await bcrypt.hash(password, 10);
// //     const user = await User.create({ name, email, password: hashed, phone });
// //     res.json({ message: '✅ Registered successfully', user });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // LOGIN
// // router.post('/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ message: 'User not found' });

// //     const match = await bcrypt.compare(password, user.password);
// //     if (!match) return res.status(400).json({ message: 'Wrong password' });

// //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// //     res.json({ message: '✅ Login successful', token, user });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// // REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: 'Email already registered!' });
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, phone });

//     res.json({ message: '✅ Registered successfully!', user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found! Please register first.' });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({ message: 'Wrong password!' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     res.json({
//       message: '✅ Login successful!',
//       token,
//       user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Email already registered!' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });

    res.json({
      message: '✅ Registered successfully!',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found! Please register first.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Wrong password!' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: '✅ Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;