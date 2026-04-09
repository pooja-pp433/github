const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String
});

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Direct collection se data lo
    const admins = await mongoose.connection.db.collection('admins').find({}).toArray();
    console.log('Admins in DB:', JSON.stringify(admins, null, 2));
    
    process.exit();
  })
  .catch(err => {
    console.log('Error:', err);
    process.exit();
  });
  