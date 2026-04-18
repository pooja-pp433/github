const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ══════════════════════════════════════
// SOCIAL SCHEMA (likes + comments)
// ══════════════════════════════════════
const socialSchema = new mongoose.Schema({
  busId:    { type: String, required: true, unique: true },
  busName:  { type: String },
  likes:    { type: Number, default: 0 },
  likedBy:  [{ userId: String, userName: String }],
  comments: [{
    userId:    String,
    userName:  String,
    text:      String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Social = mongoose.models.Social || mongoose.model('Social', socialSchema);

// ══════════════════════════════════════
// ❤️ POST /api/social/like
// ══════════════════════════════════════
router.post('/like', async (req, res) => {
  try {
    const { busId, userId, userName, busName, action } = req.body;

    let social = await Social.findOne({ busId });
    if (!social) {
      social = new Social({ busId, busName, likes: 0, likedBy: [], comments: [] });
    }

    const alreadyLiked = social.likedBy.some(l => l.userId === userId);

    if (action === 'like' && !alreadyLiked) {
      social.likedBy.push({ userId, userName });
      social.likes += 1;
    } else if (action === 'unlike' && alreadyLiked) {
      social.likedBy = social.likedBy.filter(l => l.userId !== userId);
      social.likes = Math.max(social.likes - 1, 0);
    }

    await social.save();
    res.json({ success: true, likes: social.likes, likedBy: social.likedBy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// 💬 POST /api/social/comment
// ══════════════════════════════════════
router.post('/comment', async (req, res) => {
  try {
    const { busId, userId, userName, busName, text } = req.body;

    let social = await Social.findOne({ busId });
    if (!social) {
      social = new Social({ busId, busName, likes: 0, likedBy: [], comments: [] });
    }

    social.comments.push({ userId, userName, text, createdAt: new Date() });
    await social.save();

    res.json({ success: true, comments: social.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// 📊 GET /api/social/all  (Admin ke liye)
// ══════════════════════════════════════
router.get('/all', async (req, res) => {
  try {
    const allSocial = await Social.find({}).sort({ likes: -1 });
    res.json(allSocial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════
// 📊 GET /api/social/:busId
// ══════════════════════════════════════
router.get('/:busId', async (req, res) => {
  try {
    const social = await Social.findOne({ busId: req.params.busId });
    res.json(social || { busId: req.params.busId, likes: 0, likedBy: [], comments: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;