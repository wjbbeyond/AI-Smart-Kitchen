import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  title?: string;
  subtitle?: string;
  dragText?: string;
  readyText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelected, 
  selectedImage, 
  onClear,
  title = "Take a photo or upload image",
  subtitle = "Click to browse or drag and drop your image here.",
  dragText = "Click to browse or drag and drop.",
  readyText = "Image ready for analysis"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  if (selectedImage) {
    return (
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100 group">
        <img 
          src={selectedImage} 
          alt="Selected content" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          onClick={onClear}
          className="absolute top-4 right-4 bg-white/90 text-slate-700 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
          {readyText}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-64 md:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden
        ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-white'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="bg-emerald-100 p-4 rounded-full mb-4 text-emerald-600">
        <Camera size={32} />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">
        {title}
      </h3>
      <p className="text-slate-500 text-sm text-center max-w-xs px-4">
        {subtitle}
      </p>
      
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 transition-opacity duration-300" style={{ opacity: isDragging ? 1 : 0 }} />
    </div>
  );
};