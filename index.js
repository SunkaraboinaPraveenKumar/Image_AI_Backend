import express from 'express';
import * as dotenv from 'dotenv';
import connectDb from './mongodb/connect.js';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { __dirname } from './helper.js'

import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(morgan('combined')); // Use morgan for logging HTTP requests

// Routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get("/", (req, res) => {
  res.send("Hello from Hugging Face API Image Generation!!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const startServer = async () => {
  try {
    await connectDb(process.env.MONGODB_URL);
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`Server has started on port http://localhost:${PORT}`)
    );
  } catch (err) {
    console.log('Error starting the server:', err);
  }
};

startServer();
