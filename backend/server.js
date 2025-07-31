require('dotenv').config();  // Load environment variables

const express = require('express');
const cors = require('cors');

const uploadRoutes = require('./routes/upload');
const chatRoutes = require('./routes/chat');

const app = express();

// Enable CORS for frontend to connect
app.use(cors());

// Parse incoming JSON in requests
app.use(express.json());

// Serve uploaded PDFs statically at /uploads
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
