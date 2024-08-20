
import { GoogleGenerativeAI } from '@google/generative-ai';

export const configureGemini = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("API key not found in environment variables");
  }

  // Initialize GoogleGenerativeAI with API key
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};


// file: config/vertex-ai-config.js
// import { VertexAI } from '@google-cloud/aiplatform';

// export const configureVertexAI = () => {
//   const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
//   const location = process.env.GOOGLE_CLOUD_LOCATION; // e.g., "us-central1"
//   const apiKey = process.env.GOOGLE_API_KEY;

//   if (!projectId || !location || !apiKey) {
//     throw new Error("Missing environment variables for Google Cloud");
//   }

//   const clientOptions = {
//     apiEndpoint: `${location}-aiplatform.googleapis.com`,
//     credentials: {
//       apiKey: apiKey,
//     },
//   };

//   return new VertexAI.AIPlatformClient(clientOptions);
// };
