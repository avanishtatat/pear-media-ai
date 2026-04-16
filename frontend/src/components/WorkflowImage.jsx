
import React, { useEffect, useState } from 'react';
import { Upload, Sparkles, Loader2, Eye } from 'lucide-react';
import { analyzeImageWithGemini, generateImageVariations } from '../utils/apiHelpers';
import ImageCard from './ImageCard';

const WorkflowImage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variationImage, setVariationImage] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setUploadedImage(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return imageUrl;
    });
    setAnalysis(null);
    setVariationImage('');
    setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    processImageFile(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Convert image to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(uploadedImage);
      });
      const base64Image = await base64Promise;

      const analysisResult = await analyzeImageWithGemini(base64Image);
      setAnalysis(analysisResult);
    } catch (err) {
      setError('Failed to analyze image: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateVariation = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const variationUrl = await generateImageVariations(uploadedImage);
      setVariationImage(variationUrl);
    } catch (err) {
      setError('Failed to generate variation: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="text-indigo-500" size={24} />
          Stream Lab
        </h2>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="text-gray-400" size={32} />
              <span className="text-gray-500">Click or drag to upload an image</span>
            </label>
          </div>
        </div>

        {/* Preview Uploaded Image */}
        {uploadedImageUrl && (
          <div className="mb-4">
            <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-64 object-cover rounded-lg" />
          </div>
        )}

        {/* Analyze Button */}
        {uploadedImage && !analysis && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full mb-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
          </button>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Analysis Results:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Subject:</strong> {analysis.subject}</p>
              <p><strong>Colors:</strong> {Array.isArray(analysis.colors) ? analysis.colors.join(', ') : analysis.colors}</p>
              <p><strong>Style:</strong> {analysis.style}</p>
            </div>

            <button
              onClick={handleGenerateVariation}
              disabled={isGenerating}
              className="mt-4 w-full px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isGenerating ? 'Generating Variation...' : 'Generate Variation'}
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

      {/* Generated Variation */}
      {variationImage && (
        <ImageCard imageUrl={variationImage} title="Generated Variation" onDownload={true} />
      )}
    </div>
  );
};

export default WorkflowImage;