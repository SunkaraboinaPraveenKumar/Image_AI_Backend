import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds

const fetchImage = async (prompt, retries = 0) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Log the response body
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.buffer();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying due to error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS)); // Wait before retrying
      return fetchImage(prompt, retries + 1);
    } else {
      throw error; // Re-throw error after max retries
    }
  }
};

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageBuffer = await fetchImage(prompt);

    res.set('Content-Type', 'image/jpeg'); // Ensure this matches the image type
    res.status(200).send(imageBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  }
});

export default router;
