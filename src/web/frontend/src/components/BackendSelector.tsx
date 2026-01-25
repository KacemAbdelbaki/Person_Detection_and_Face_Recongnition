"use client";

interface BackendSelectorProps {
  recognitionBackends: string[];
  detectorBackends: string[];
  selectedRecognition: string;
  selectedDetector: string;
  onRecognitionChange: (backend: string) => void;
  onDetectorChange: (backend: string) => void;
  isLoading: boolean;
}

export default function BackendSelector({
  recognitionBackends,
  detectorBackends,
  selectedRecognition,
  selectedDetector,
  onRecognitionChange,
  onDetectorChange,
  isLoading,
}: BackendSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recognition Backend */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <svg
            className="w-4 h-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Recognition Model
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <select
            value={selectedRecognition}
            onChange={(e) => onRecognitionChange(e.target.value)}
            disabled={isLoading}
            className="relative w-full px-4 py-3.5 rounded-xl
                       bg-white/5 border border-white/10 
                       text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 appearance-none cursor-pointer
                       hover:bg-white/10"
          >
            {recognitionBackends.map((backend) => (
              <option
                key={backend}
                value={backend}
                className="bg-gray-900 text-white"
              >
                {backend}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-purple-500" />
          Deep learning model for face matching
        </p>
      </div>

      {/* Detector Backend */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <svg
            className="w-4 h-4 text-cyan-400"
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
          Face Detector
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
          <select
            value={selectedDetector}
            onChange={(e) => onDetectorChange(e.target.value)}
            disabled={isLoading}
            className="relative w-full px-4 py-3.5 rounded-xl
                       bg-white/5 border border-white/10 
                       text-white placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 appearance-none cursor-pointer
                       hover:bg-white/10"
          >
            {detectorBackends.map((backend) => (
              <option
                key={backend}
                value={backend}
                className="bg-gray-900 text-white"
              >
                {backend}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-cyan-500" />
          Algorithm for face detection & extraction
        </p>
      </div>
    </div>
  );
}
