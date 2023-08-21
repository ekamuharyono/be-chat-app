const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config()
const User = require('../models/user'); // Ganti dengan model pengguna Anda

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: 'Incorrect username.' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SCREETKEY, { expiresIn: '1h' })
    res.status(200).json({ message: 'Login successful.', username, token });
  } catch (err) {
    return err
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists.');
    }

    // Generate salt and hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user with hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.send('Registration successful.');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while registering.');
  }
});

module.exports = router;