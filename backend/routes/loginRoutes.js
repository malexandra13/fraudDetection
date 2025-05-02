const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, ClientProfile } = require('../models');

const SECRET_KEY = 'cheie-secreta-banca';
const saltRounds = 10;

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

const isPasswordValid = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Autentificare utilizator
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email }, include: [
      {
        model: ClientProfile,
      }
    ] });
    if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });
    const validPassword = password === user.password || await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Parolă incorectă.' });

    const token = jwt.sign({ id: user.id, role: user.role, user }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role, userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { password, email } = req.body;
    const encrypted = await hashPassword(password);
    const newUser = await User.create({
      role: req.body.role ? req.body.role : 'client',
      password: encrypted, email
    });
    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);

  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err });
  }
});

module.exports = router;
