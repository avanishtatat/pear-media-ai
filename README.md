# PearMedia AI Studio

PearMedia AI Studio is a full-stack AI media application built for an interview assignment. It combines a modern React frontend with a secure Express backend to deliver two practical AI workflows: text-to-image generation and image-to-variation generation.

The project is designed to show more than API integration. It demonstrates product thinking, full-stack architecture, secure provider orchestration, and user-focused interaction design.

## Highlights

- Built a React single-page application for AI-assisted media creation
- Developed an Express API layer to keep provider credentials off the client
- Integrated Gemini for prompt enhancement and image analysis
- Integrated Hugging Face FLUX for image generation and visual variation workflows
- Structured the codebase into separate frontend and backend applications for cleaner development and deployment

## Core Workflows

### Creative Studio

Users start with a basic text idea, enhance it into a richer visual prompt, and generate an AI image.

### Stream Lab

Users upload an image, extract structured visual insights, and generate a creative AI variation.

## Why This Project Is Stronger Than a Simple Demo

- Clear separation between frontend presentation and backend AI orchestration
- Provider keys remain on the server instead of being exposed in the browser
- Real UX states for loading, error handling, and downloadable results
- Multi-step AI workflow design instead of a single prompt-to-response interaction
- Documentation prepared for assignment review, portfolio use, and recruiter scanning

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Axios
- AI Providers: Gemini, Hugging Face FLUX

## Architecture Overview

The application is split into two services:

1. Frontend: React SPA for interaction flow, state management, and results display
2. Backend: Express API for validation, secure key handling, provider requests, and normalized responses

### Workflow 1: Text to Image

1. User writes a prompt in the frontend
2. Frontend calls `/api/enhance-prompt`
3. Backend uses Gemini to improve the prompt
4. Frontend sends the enhanced prompt to `/api/generate-image`
5. Backend uses Hugging Face FLUX to generate the image

### Workflow 2: Image to Variation

1. User uploads an image
2. Frontend converts the image to base64 and calls `/api/analyze-image`
3. Backend uses Gemini to extract subject, color, and style information
4. Frontend requests `/api/generate-variation`
5. Backend generates a variation prompt and creates a new image with FLUX

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Required env:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Required env:

```dotenv
PORT=5000
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_HF_TOKEN=your_huggingface_token
```

## Repository Guide

```text
pear-media-ai/
  backend/
  frontend/
```

Additional documentation:

- Frontend details: [frontend/README.md](frontend/README.md)
- Backend details: [backend/README.md](backend/README.md)

## Deployment Recommendation

- Frontend: Vercel
- Backend: Render

This split matches the runtime characteristics of the project: a static client on Vercel and a long-running Express API on Render.

## What This Demonstrates

- Full-stack development capability
- AI product integration experience
- Secure backend API design
- Frontend state management and workflow UX
- Production-minded project structure for portfolio presentation

## Resume-Friendly Summary

Built a full-stack AI media application using React, Vite, Node.js, and Express, integrating Gemini and Hugging Face APIs for prompt enhancement, image analysis, image generation, and creative variation workflows through a secure backend proxy architecture.
