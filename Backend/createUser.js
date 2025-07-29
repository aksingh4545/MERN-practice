const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust if needed
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = new User({ email: 'test@example.com', password: hashedPassword });
    await user.save();
    console.log('User created');
    mongoose.disconnect();
  })
  .catch(err => console.error('MongoDB error:', err));
