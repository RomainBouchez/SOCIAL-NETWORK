"use client";

import { useState } from "react";
import { XIcon, UploadCloudIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append("file", file);
    
    // Use the uploadthing API endpoint directly
    try {
      const res = await fetch("/api/uploadthing", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Trigger the same upload process
      // You'd need to implement this similarly to handleFileChange
    }
  };

  if (value) {
    return (
      <div className="relative w-full">
        <img src={value} alt="Upload" className="rounded-md w-full max-h-80 object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 transition-colors rounded-full shadow-md"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }
  
  return (
    <div 
      className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-border'} rounded-md text-center p-8`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadCloudIcon className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop an image here
      </p>
      
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button
          type="button"
          variant="outline"
          className="w-full max-w-xs mx-auto mb-2"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Choose File"}
        </Button>
      </label>
      
      <p className="text-xs text-muted-foreground mt-2">
        PNG, JPG, WEBP up to 4MB
      </p>
    </div>
  );
}

export default ImageUpload;