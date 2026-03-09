require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('config');
const logger = require('./middleware/logger');
const listingsRouter = require('./routes/listings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);


// Serve static assets from public/assets under /assets route
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Import routes

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');
const notificationsRoutes = require('./routes/notifications');

// Routes
app.use('/api/listings', listingsRouter);
app.use('/api/auth', authRoutes);        // POST /auth
app.use('/api/users', usersRoutes);      // POST /users
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server using port from config
const PORT = config.get('port');
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Assets base URL: ${config.get('assetsBaseUrl')}`);
});