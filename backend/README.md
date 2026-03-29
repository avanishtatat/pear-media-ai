# PearMedia AI Studio - Backend

Express backend service for the PearMedia AI assignment project.

This backend acts as a secure proxy layer between the frontend and external AI providers:

- Gemini (prompt enhancement and image analysis)
- Hugging Face FLUX model (image generation)

## Why This Backend Is Important

This service demonstrates production-minded backend design for AI apps:

- Protects API tokens from frontend exposure
- Validates request payloads before provider calls
- Normalizes responses for predictable client integration
- Handles provider-specific failures (quota, auth, warm-up, rate limits)

## Tech Stack

- Node.js
- Express 5
- Axios
- dotenv
- cors

## Service Responsibilities

1. Accept frontend requests at /api routes.
2. Validate prompt and image payloads.
3. Call Gemini or Hugging Face with server-side credentials.
4. Return stable JSON responses to frontend.

## Setup

Prerequisites:

- Node.js 18 or higher
- npm

Install dependencies:

    npm install

Create environment file:

On Bash:

    cp .env.example .env

On Windows PowerShell:

    Copy-Item .env.example .env

Update .env with your credentials.

## Environment Variables

- PORT: backend port (default 5000)
- VITE_GEMINI_API_KEY: Google Gemini API key
- VITE_HF_TOKEN: Hugging Face access token

Example:

    PORT=5000
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_HF_TOKEN=your_huggingface_token

## Run

Development (watch mode):

    npm run dev

Production:

    npm start

Default URL:

    http://localhost:5000

## API Reference

Base path:

    /api

1) POST /api/enhance-prompt

Purpose: Expands a short user prompt into a richer, image-model-friendly prompt.

Request:

    {
      "prompt": "a futuristic city at sunset"
    }

Success response:

    {
      "success": true,
      "enhancedPrompt": "..."
    }

2) POST /api/analyze-image

Purpose: Analyzes uploaded base64 image and returns structured visual attributes.

Request:

    {
      "base64Image": "data:image/png;base64,iVBORw0..."
    }

Success response:

    {
      "success": true,
      "analysis": {
        "subject": "...",
        "colors": ["...", "...", "..."],
        "style": "..."
      }
    }

3) POST /api/generate-image

Purpose: Generates an image from text prompt using FLUX model.

Request:

    {
      "prompt": "cinematic portrait of a robot, neon lighting"
    }

Success response:

    {
      "success": true,
      "image": "data:image/png;base64,..."
    }

4) POST /api/generate-variation

Purpose: Uses image-to-prompt analysis plus FLUX generation to create a creative variation.

Request:

    {
      "base64Image": "data:image/jpeg;base64,/9j/4AAQ..."
    }

Success response:

    {
      "success": true,
      "image": "data:image/png;base64,...",
      "prompt": "generated variation prompt"
    }

## Error Handling Notes

- 400 for invalid input payloads
- 401 or 403 for invalid or missing provider keys
- 429 for quota or rate limit issues
- 503 for model warm-up cases
- 500 for unexpected provider or server failures

## Security and Portfolio Notes

- Never commit .env with real API keys.
- Rotate credentials immediately if they were ever pushed publicly.
- Use this backend design in your portfolio to explain secure AI API orchestration.
