const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validate = require('../middleware/validate');

const users = require('../data/users');


// Validation schema using Joi
const validateAuth = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4)
  });
  return schema.validate(body);
};


router.post('/', validate(validateAuth), async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).send({ error: 'Invalid email or password.' });
  }

  // Compare passwords
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send({ error: 'Invalid email or password.' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '7d' } // optional
  );

  // Send token as plain text (string)
  res.send(token);
});

module.exports = router;