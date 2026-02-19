import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function generateImage() {
  try {
    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-image",  // valid image generation model
      contents: [
        "Generate an image of a futuristic city skyline at dusk, cinematic lighting."
      ],
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: {
          size: "1024x1024" // correct field for Gemini image models
        }
      }
    });

    // The image URL/Base64 is typically in response.candidates[0].image.uri
    console.log(response.candidates[0].image.uri);
  } catch (err) {
    console.error("Error generating image:", err);
  }
}

generateImage();