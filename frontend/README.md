# PearMedia AI Studio - Frontend

Production-style React frontend for the PearMedia AI assignment project.

This client app delivers two AI workflows through a clean interface:

- Creative Studio (Text to Image): write a prompt, enhance it with Gemini, then generate image output.
- Stream Lab (Image to Variation): upload an image, analyze visual attributes, then create a model-generated variation.

## Why This Project Matters

This project demonstrates practical full-stack AI integration skills:

- Building a modern React UI for AI workflows
- Orchestrating multi-step AI pipelines through backend APIs
- Handling asynchronous states, failures, retries, and user feedback
- Keeping provider secrets off the client by using a backend proxy

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React
- Fetch API

## Architecture

Frontend does not call Gemini or Hugging Face directly.

Flow:

1. React UI sends requests to backend proxy endpoints.
2. Backend securely calls Gemini and Hugging Face.
3. Frontend renders structured responses and generated images.

Default backend base URL: http://localhost:5000/api

## Setup

Prerequisites:

- Node.js 18 or higher
- npm
- Running backend service from sibling backend folder

Install dependencies:

	npm install

Create frontend environment file:

File: .env

	VITE_API_BASE_URL=http://localhost:5000/api

Important: frontend only needs VITE_API_BASE_URL.

## Run

Development:

	npm run dev

Production build:

	npm run build

Preview production build:

	npm run preview

Lint:

	npm run lint

## Feature Walkthrough

Creative Studio:

1. User enters a base prompt.
2. App requests prompt enhancement from backend endpoint /api/enhance-prompt.
3. User can edit enhanced prompt.
4. App requests image generation from /api/generate-image.
5. Result image is shown with download option.

Stream Lab:

1. User uploads an image.
2. App sends image to /api/analyze-image.
3. Analysis data (subject, colors, style) is shown.
4. App requests variation via /api/generate-variation.
5. Generated variation is shown with download option.

## API Dependency

This frontend depends on these backend endpoints:

- POST /api/enhance-prompt
- POST /api/generate-image
- POST /api/analyze-image
- POST /api/generate-variation

If your backend is hosted elsewhere, update VITE_API_BASE_URL.

## Folder Structure

	frontend/
	  src/
		components/
		  WorkflowText.jsx
		  WorkflowImage.jsx
		  ImageCard.jsx
		  Navbar.jsx
		utils/
		  apiHelpers.js
		App.jsx
		main.jsx

## Portfolio-Ready Summary

PearMedia AI Studio frontend highlights your ability to:

- Build polished, stateful React interfaces
- Integrate real AI workflows into product UX
- Design for reliability with loading and error states
- Consume backend APIs cleanly through reusable helper modules
