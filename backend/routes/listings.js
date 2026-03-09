const express = require('express');
const router = express.Router();
const config = require('config');
const multer = require('multer');
const path = require('path');
const listings = require('../store/listings');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'assets')); // save to uploads folder
  },
  filename: (req, file, cb) => {
    // Get the original filename from client
    const originalName = file.originalname; // e.g., "image0.jpg"
    const ext = path.extname(originalName);  // e.g., ".jpg"
    const baseName = path.basename(originalName, ext); // e.g., "image0"
    
    // Create a unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const finalName = `${baseName}-${uniqueSuffix}${ext}`;
    
    console.log('Saving file as:', finalName);
    cb(null, finalName);
  }
});

const upload = multer({ storage });

// Ensure base URL ends with a slash
const baseUrl = config.get('assetsBaseUrl').replace(/\/?$/, '/');

// GET /api/listings
router.get('/', (req, res) => {
  const transformedListings = listings.map(listing => ({
    ...listing,
    images: listing.images.map(img => ({
      url: baseUrl + img.url,
      thumbnailUrl: baseUrl + (img.thumbnailUrl || img.url)
    }))
  }));
  res.json(transformedListings);
});

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  const transformed = {
    ...listing,
    images: listing.images.map(img => ({
      url: baseUrl + img.url,
      thumbnailUrl: baseUrl + img.thumbnailUrl
    }))
  };
  res.json(transformed);
});

// POST /api/listings
router.post('/', upload.array('images'), (req, res) => {
  console.log('=== New POST /api/listings ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    console.log('No files received');
    return res.status(400).json({ error: 'No images uploaded' });
  }

  try {
    const { title, price, categoryId, description, location } = req.body;

    // Basic validation
    if (!title || !price || !categoryId) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse location if provided
    let parsedLocation = null;
    if (location) {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        console.log('Invalid location JSON');
        return res.status(400).json({ error: 'Invalid location format' });
      }
    }

    // Build images array with filenames
    const images = req.files.map(file => ({
      url: file.filename,
      thumbnailUrl: file.filename  // using same file for simplicity
    }));

    const newListing = {
      id: listings.length + 1,
      title,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      description,
      userId: 1,
      location: parsedLocation,
      images
    };

    listings.push(newListing);
    console.log('New listing added:', newListing.id);

    // Build response with full URLs
    const baseUploadUrl = config.get('assetsBaseUrl').replace('/assets/', '/uploads/');
    const responseListing = {
      ...newListing,
      images: newListing.images.map(img => ({
        url: baseUploadUrl + img.url,
        thumbnailUrl: baseUploadUrl + img.url
      }))
    };

    res.status(201).json(responseListing);
  } catch (error) {
    console.error('Error in POST /listings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;