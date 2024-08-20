import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongodb/models/post.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames
import { fileURLToPath } from 'url'; // Required to create __dirname equivalent

dotenv.config();

const router = express.Router();

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET all posts
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error('Error fetching posts:', err); // Log the error
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

// POST a new post
router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    if (!name || !prompt || !photo) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Decode base64 string to buffer
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, ""); // Handles multiple image types
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename
    const filename = `${uuidv4()}.jpg`;
    const filepath = path.join(__dirname, '../uploads', filename);

    // Save the buffer as an image file
    fs.writeFileSync(filepath, imgBuffer);

    // Create new post with the image file path
    const newPost = await Post.create({
      name,
      prompt,
      photo: `/uploads/${filename}`, // Assuming you serve the uploads folder as static
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again', error: err.message });
  }
});

export default router;
