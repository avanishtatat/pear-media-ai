import React, { useState } from 'react';
import { Layers, Image as ImageIcon, Type } from 'lucide-react';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 border">
      {/* Header */}
      <header className="flex items-center bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Layers className="text-indigo-500" size={28} />
            <h1 className="text-xl font-bold text-gray-800">PearMedia AI Studio</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition cursor-pointer ${activeTab === 'text'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Type size={18} />
            Creative Studio (Text)
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition cursor-pointer ${activeTab === 'image'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <ImageIcon size={18} />
            Stream Lab (Image)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'text' ? (
          <WorkflowText  />
        ) : (
          <WorkflowImage  />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        PearMedia AI Assignment • Built with React + Vite + Hugging Face + Gemini
      </footer>
    </div>
  );
}

export default App;