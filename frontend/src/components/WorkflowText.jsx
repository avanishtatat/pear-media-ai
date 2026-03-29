
import React, { useState } from 'react';
import { Sparkles, Edit3, Image as ImageIcon, Loader2 } from 'lucide-react';
import { enhancePromptWithGemini, generateImageFromPrompt } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowText = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [error, setError] = useState('');

  const handleEnhance = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsEnhancing(true);
    setError('');
    setEnhancedPrompt('');
    setGeneratedImage('');

    try {
      const enhanced = await enhancePromptWithGemini(userPrompt)
      setEnhancedPrompt(enhanced);
    } catch (err) {
      setError('Failed to enhance prompt: ' + err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!enhancedPrompt.trim()) {
      setError('Please enhance the prompt first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const imageUrl = await generateImageFromPrompt(enhancedPrompt)
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate image: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={24} />
          Creative Studio
        </h2>

        {/* User Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Prompt
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A cat sitting on a throne, cyberpunk style..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows="3"
          />
          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="mt-3 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isEnhancing ? <Loader2 className="animate-spin" size={18} /> : <Edit3 size={18} />}
            {isEnhancing ? 'Enhancing...' : 'Enhance Prompt'}
          </button>
        </div>

        {/* Enhanced Prompt */}
        {enhancedPrompt && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enhanced Prompt (Edit if needed)
            </label>
            <textarea
              value={enhancedPrompt}
              onChange={(e) => setEnhancedPrompt(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 bg-green-50 rounded-lg resize-none"
              rows="5"
            />
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="mt-3 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Generated Image */}
      {generatedImage && (
        <ImageCard imageUrl={generatedImage} title="Generated Image" onDownload={true} />
      )}
    </div>
  );
};

export default WorkflowText;