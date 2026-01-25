"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";
import BackendSelector from "@/components/BackendSelector";
import ResultsDisplay from "@/components/ResultsDisplay";
import { getBackends, recognizeFaces, checkHealth } from "@/lib/api";
import { RecognitionResponse } from "@/types";

const DEFAULT_RECOGNITION_BACKENDS = [
  "VGG-Face",
  "Facenet",
  "Facenet512",
  "OpenFace",
  "DeepFace",
  "DeepID",
  "ArcFace",
  "Dlib",
  "SFace",
  "GhostFaceNet",
];

const DEFAULT_DETECTOR_BACKENDS = [
  "opencv",
  "ssd",
  "dlib",
  "mtcnn",
  "retinaface",
  "mediapipe",
  "yolov8",
  "yunet",
  "fastmtcnn",
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognitionBackends, setRecognitionBackends] = useState<string[]>(
    DEFAULT_RECOGNITION_BACKENDS,
  );
  const [detectorBackends, setDetectorBackends] = useState<string[]>(
    DEFAULT_DETECTOR_BACKENDS,
  );
  const [selectedRecognition, setSelectedRecognition] = useState("VGG-Face");
  const [selectedDetector, setSelectedDetector] = useState("opencv");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecognitionResponse | null>(null);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkBackend = async () => {
      const isHealthy = await checkHealth();
      setBackendStatus(isHealthy ? "online" : "offline");

      if (isHealthy) {
        try {
          const backends = await getBackends();
          setRecognitionBackends(backends.recognition_backends);
          setDetectorBackends(backends.detector_backends);
        } catch (e) {
          console.error("Failed to fetch backends:", e);
        }
      }
    };

    checkBackend();
  }, []);

  const handleImageSelect = (base64: string) => {
    setSelectedImage(base64);
    setResults(null);
    setError(null);
  };

  const handleRecognize = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await recognizeFaces(
        selectedImage,
        selectedRecognition,
        selectedDetector,
      );
      setResults(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Recognition failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.03)%22/%3E%3C/svg%3E')] opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                    FaceVision AI
                  </h1>
                  <p className="text-sm text-gray-500">
                    Powered by YOLO & DeepFace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {mounted && (
                  <div
                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    backdrop-blur-xl border transition-all duration-500
                    ${
                      backendStatus === "online"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : backendStatus === "offline"
                          ? "bg-red-500/10 border-red-500/30 text-red-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }
                  `}
                  >
                    <span
                      className={`
                      w-2 h-2 rounded-full
                      ${
                        backendStatus === "online"
                          ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                          : backendStatus === "offline"
                            ? "bg-red-400 shadow-lg shadow-red-400/50"
                            : "bg-amber-400 shadow-lg shadow-amber-400/50 animate-pulse"
                      }
                    `}
                    />
                    {backendStatus === "online"
                      ? "API Connected"
                      : backendStatus === "offline"
                        ? "API Offline"
                        : "Connecting..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm text-purple-300">
                AI-Powered Face Recognition
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Detect & Recognize Faces
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                In Seconds
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload any image with multiple people and watch our AI identify
              each person using state-of-the-art deep learning models.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 pb-16">
          {mounted && backendStatus === "offline" && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-2">
                    Backend Not Available
                  </h3>
                  <p className="text-red-200/70 mb-4">
                    Start the Flask backend to enable face recognition:
                  </p>
                  <code className="block p-4 rounded-xl bg-black/40 text-sm text-gray-300 font-mono">
                    cd backend && pip install -r requirements.txt && python
                    app.py
                  </code>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Settings */}
            <div className="space-y-6">
              {/* Upload Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Upload Image
                      </h3>
                      <p className="text-sm text-gray-500">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Settings Card */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        AI Models
                      </h3>
                      <p className="text-sm text-gray-500">
                        Configure recognition settings
                      </p>
                    </div>
                  </div>
                  <BackendSelector
                    recognitionBackends={recognitionBackends}
                    detectorBackends={detectorBackends}
                    selectedRecognition={selectedRecognition}
                    selectedDetector={selectedDetector}
                    onRecognitionChange={setSelectedRecognition}
                    onDetectorChange={setSelectedDetector}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleRecognize}
                  disabled={
                    !selectedImage || isLoading || backendStatus !== "online"
                  }
                  className="flex-1 group relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] group-hover:animate-shimmer" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 blur-xl" />
                  </div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Start Recognition
                      </>
                    )}
                  </span>
                </button>

                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-6 py-4 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10
                           hover:bg-white/10 hover:border-white/20 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Right Column - Results Preview */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              {results && results.success ? (
                <ResultsDisplay
                  results={results.results}
                  annotatedImage={results.annotated_image}
                  recognitionBackend={results.recognition_backend}
                  personsDetected={results.persons_detected}
                />
              ) : (
                <div className="relative h-full min-h-[400px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                    <svg
                      className="w-12 h-12 text-purple-400/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Results Yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-xs">
                    Upload an image and click &quot;Start Recognition&quot; to
                    see detected faces and matches
                  </p>

                  {/* Feature highlights */}
                  <div className="mt-8 w-full space-y-3">
                    {[
                      { icon: "🎯", text: "YOLO person detection" },
                      { icon: "🧠", text: "DeepFace recognition" },
                      { icon: "⚡", text: "Multiple model options" },
                    ].map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <span className="text-xl">{feature.icon}</span>
                        <span className="text-sm text-gray-400">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-xl bg-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                FaceVision AI • Built with Next.js, YOLO & DeepFace
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  AI Models & Applications
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
