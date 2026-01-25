"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  isLoading: boolean;
}

export default function ImageUpload({
  onImageSelect,
  selectedImage,
  isLoading,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          onImageSelect(base64);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer
          transition-all duration-500 ease-out
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
      >
        <input {...getInputProps()} />

        {/* Animated border */}
        <div
          className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300
          ${isDragActive || dragActive ? "opacity-100" : "opacity-0"}
        `}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-spin-slow"
            style={{ padding: "2px" }}
          >
            <div className="w-full h-full rounded-2xl bg-[#0a0a0f]" />
          </div>
        </div>

        <div
          className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center
          transition-all duration-300 ease-out min-h-[200px] flex items-center justify-center
          ${
            isDragActive || dragActive
              ? "border-purple-500/50 bg-purple-500/10"
              : "border-white/10 hover:border-purple-500/30 hover:bg-white/5"
          }
        `}
        >
          {selectedImage ? (
            <div className="space-y-4 w-full">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="relative max-h-64 mx-auto rounded-xl shadow-2xl shadow-purple-500/10 ring-1 ring-white/10"
                />
              </div>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
                </div>
                <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-white mb-1">
                  Drop your image here
                </p>
                <p className="text-sm text-gray-500">
                  or{" "}
                  <span className="text-purple-400 hover:text-purple-300 transition-colors">
                    browse files
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
                <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                  JPEG
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                  PNG
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                  WebP
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
