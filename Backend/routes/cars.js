const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Car = require('../models/Car');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { make, model, year } = req.body;
  try {
    const newCar = new Car({ make, model, year });
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: 'Invalid car data' });
  }
});

module.exports = router;