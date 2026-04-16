
import React from 'react';

const ImageCard = ({ imageUrl, title, onDownload }) => {
  if (!imageUrl) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        {onDownload && (
          <a
            href={imageUrl}
            download="generated-image.png"
            className="inline-block px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition cursor-pointer"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export default ImageCard;