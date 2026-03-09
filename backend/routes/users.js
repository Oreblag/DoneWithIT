const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validate = require('../middleware/validate');

const users = require('../data/users'); 

// Simple ID generator for dummy data
let nextId = 1;

const validateUser = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4)
  });
  return schema.validate(body);
};

router.post('/', validate(validateUser), async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).send({ error: 'User already registered.' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = {
    id: nextId++,
    name,
    email,
    password: hashedPassword
  };
  users.push(user);

  // Return user info (excluding password)
  res.status(201).send({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

module.exports = router;