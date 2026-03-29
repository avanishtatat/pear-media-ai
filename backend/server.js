// backend/server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads

// ========== GEMINI PROXY ENDPOINTS ==========

// Endpoint for prompt enhancement
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    // ✅ Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    // ✅ Reasonable length cap to prevent abuse
    if (prompt.length > 500) {
      return res.status(400).json({ success: false, error: 'Prompt must be under 500 characters.' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    const response = await axios({
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        // ✅ Use systemInstruction to isolate your instructions from user input
        //    This prevents user text from overriding your directive
        systemInstruction: {
          parts: [{
            text: "You are an expert prompt engineer for AI image generation. Your sole job is to transform a user's simple image request into a rich, descriptive ~50-word prompt. Always include: lighting, camera angle, and artistic style. Return ONLY the enhanced prompt — no preamble, no explanation, no quotes."
          }]
        },
        contents: [{
          role: 'user',
          parts: [{
            // ✅ User input is now data, not instructions — injection-safe
            text: prompt.trim()
          }]
        }],
        generationConfig: {
          // ✅ Disable thinking — this is a simple creative task, not reasoning
          thinkingConfig: { thinkingBudget: 0 },
          // ✅ Cap output so it doesn't ramble past the enhanced prompt
          maxOutputTokens: 200,
        }
      }
    });

    const enhancedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!enhancedText) {
      return res.status(500).json({ success: false, error: 'Model returned an empty response.' });
    }

    res.json({ success: true, enhancedPrompt: enhancedText });

  } catch (error) {
    const status = error.response?.status;
    const geminiMessage = error.response?.data?.error?.message;
    console.error('Enhancement error:', status, geminiMessage || error.message);

    if (status === 429) {
      res.status(429).json({ success: false, error: 'Quota exceeded. Please try again later.' });
    } else if (status === 401 || status === 403) {
      res.status(403).json({ success: false, error: 'Invalid or missing Gemini API key.' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to enhance prompt.' });
    }
  }
});

// Endpoint for image analysis
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { base64Image } = req.body;

    // ✅ Validate input before hitting the API
    if (!base64Image || !base64Image.includes(',')) {
      return res.status(400).json({ success: false, error: 'Invalid or missing base64 image.' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    // ✅ Use the stable model string (no preview suffix)
    const response = await axios({
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        contents: [{
          parts: [
            {
              text: `Analyze this image and return ONLY a raw JSON object (no markdown, no backticks) with exactly these keys:
- "subject": string describing the main objects/subject
- "colors": array of exactly 3 dominant color names
- "style": string describing the artistic style (e.g. realistic, cyberpunk, oil painting, cartoon)

Example: {"subject":"a red sports car","colors":["red","black","silver"],"style":"realistic photography"}`
            },
            {
              inline_data: {
                // ✅ Detect mime type from the data URL prefix, fallback to jpeg
                mime_type: base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                data: base64Image.split(',')[1]
              }
            }
          ]
        }],
        // ✅ Disable thinking for a simple structured output task — faster & cheaper
        generationConfig: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      }
    });

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // ✅ More robust JSON extraction — strips ```json fences and stray whitespace
    let analysisResult;
    try {
      const cleaned = rawText.replace(/```(?:json)?/g, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      // Validate expected keys exist
      if (!analysisResult?.subject || !analysisResult?.colors || !analysisResult?.style) {
        throw new Error('Missing expected keys');
      }
    } catch (e) {
      console.warn('JSON parse failed, using fallback. Raw text:', rawText);
      analysisResult = {
        subject: "uploaded image",
        colors: ["various"],
        style: rawText.substring(0, 100) || "artistic"
      };
    }

    res.json({ success: true, analysis: analysisResult });

  } catch (error) {
    const status = error.response?.status;
    const geminiMessage = error.response?.data?.error?.message;
    console.error('Analysis error:', status, geminiMessage || error.message);

    // ✅ Specific error codes from Gemini API
    if (status === 400) {
      res.status(400).json({ success: false, error: geminiMessage || 'Bad request — check image format.' });
    } else if (status === 429) {
      res.status(429).json({ success: false, error: 'Quota exceeded. Please try again later.' });
    } else if (status === 401 || status === 403) {
      res.status(403).json({ success: false, error: 'Invalid or missing Gemini API key.' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to analyze image.' });
    }
  }
});

// ========== HUGGING FACE PROXY ENDPOINTS ==========

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const hfToken = process.env.VITE_HF_TOKEN;
    const MODEL_ID = "black-forest-labs/FLUX.1-schnell";

    const response = await axios({
      method: 'POST',
      // ✅ Updated to the new router endpoint
      url: `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`,
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png', // ✅ Explicitly tell the API you want an image back
      },
      data: {
        inputs: prompt,
        // ⚠️ FLUX.1-schnell does not support negative_prompt — remove it
        parameters: {}
      },
      responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;
    res.json({ success: true, image: imageUrl });

  } catch (error) {
    console.error('Image generation error:', error.response?.status, error.message);

    const status = error.response?.status;
    if (status === 503) {
      res.json({ success: false, error: "Model is warming up, please try again in 10 seconds" });
    } else if (status === 410) {
      res.status(410).json({ success: false, error: "API endpoint is deprecated. Please update the URL." });
    } else if (status === 401) {
      res.status(401).json({ success: false, error: "Invalid or missing Hugging Face token." });
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate image' });
    }
  }
});

// Endpoint for image variations
app.post('/api/generate-variation', async (req, res) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image || !base64Image.includes(',')) {
      return res.status(400).json({ success: false, error: 'Invalid or missing image.' });
    }

    const geminiKey = process.env.VITE_GEMINI_API_KEY;
    const hfToken = process.env.VITE_HF_TOKEN;

    // ── STEP 1: Use Gemini to deeply analyze the image ──────────────────────
    const analyzeResponse = await axios({
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        systemInstruction: {
          parts: [{
            text: `You are an expert image-to-prompt reverse engineer. 
Your job is to write a vivid, detailed text-to-image prompt that would recreate the provided image with a creative variation. 
Include subject, composition, lighting, color palette, artistic style, and mood.
Return ONLY the prompt string — no explanation, no preamble, no quotes.`
          }]
        },
        contents: [{
          role: 'user',
          parts: [
            {
              inline_data: {
                mime_type: base64Image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                data: base64Image.split(',')[1]
              }
            },
            { text: "Generate a creative variation prompt for this image." }
          ]
        }],
        generationConfig: {
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: 200
        }
      }
    });

    const variationPrompt = analyzeResponse.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!variationPrompt) {
      return res.status(500).json({ success: false, error: 'Failed to analyze image for variation.' });
    }

    // ── STEP 2: Feed the prompt into FLUX to generate the variation ──────────
    const imageResponse = await axios({
      method: 'POST',
      url: `https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell`,
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png',
      },
      data: { inputs: variationPrompt },
      responseType: 'arraybuffer'
    });

    const base64Variation = Buffer.from(imageResponse.data, 'binary').toString('base64');
    const variationUrl = `data:image/png;base64,${base64Variation}`;

    // Return both the variation image and the prompt used (useful for UI display)
    res.json({ success: true, image: variationUrl, prompt: variationPrompt });

  } catch (error) {
    const status = error.response?.status;
    console.error('Variation error:', status, error.message);

    if (status === 503) {
      res.status(503).json({ success: false, error: "Model is warming up, please try again shortly." });
    } else if (status === 429) {
      res.status(429).json({ success: false, error: "Rate limit hit. Please wait before retrying." });
    } else if (status === 401) {
      res.status(401).json({ success: false, error: "Invalid or missing API token." });
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate variation.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});