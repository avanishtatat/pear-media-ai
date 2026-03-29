

// // const response = await geminiClient.models.generateContent({
// //   model: "gemini-2.5-flash",
// //   contents: [
// //     {
// //       role: "system",
// //       text: "You are an expert prompt engineer. Transform the following simple request into a 50-word descriptive masterpiece including lighting, camera angle, and artistic style."
// //     },
// //     {
// //       role: "user",
// //       text: userPrompt
// //     }
// //   ]
// // })


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseUrl = apiBaseUrl.replace(/\/$/, '');

export const enhancePromptWithGemini = async (userPrompt) => {
  try {
    const response = await fetch(`${baseUrl}/enhance-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt })
    });
    const data = await response.json();
    if (data.success) return data.enhancedPrompt;
    throw new Error(data.error || 'Failed to enhance prompt');
  } catch (error) {
    console.error("Enhancement Error:", error);
    return userPrompt;
  }
};

export const generateImageFromPrompt = async (prompt) => {
  try {
    const response = await fetch(`${baseUrl}/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (data.success) return data.image;
    throw new Error(data.error || 'Image generation failed');
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
};

export const analyzeImageWithGemini = async (base64Image) => {
  try {
    const response = await fetch(`${baseUrl}/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image })
    });
    const data = await response.json();
    if (data.success) return data.analysis;
    throw new Error(data.error || 'Analysis failed');
  } catch (error) {
    console.error("Analysis Error:", error);
    return { subject: "uploaded image", colors: ["various"], style: "creative" };
  }
};

export const generateImageVariations = async (imageFile) => {
  try {
    // Convert file to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imageFile);
    });
    const base64Image = await base64Promise;

    const response = await fetch(`${baseUrl}/generate-variation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image })
    });
    const data = await response.json();
    if (data.success) return data.image;
    throw new Error(data.error || 'Variation generation failed');
  } catch (error) {
    console.error("Variation Error:", error);
    throw error;
  }
};