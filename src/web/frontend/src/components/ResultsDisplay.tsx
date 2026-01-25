"use client";

import { PersonResult } from "@/types";

interface ResultsDisplayProps {
  results: PersonResult[];
  annotatedImage: string | null;
  recognitionBackend: string;
  personsDetected: number;
}

export default function ResultsDisplay({
  results,
  annotatedImage,
  recognitionBackend,
  personsDetected,
}: ResultsDisplayProps) {
  if (results.length === 0) {
    return null;
  }

  const totalFaces = results.reduce((sum, p) => sum + p.faces.length, 0);

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {personsDetected}
            </div>
            <div className="text-xs text-gray-500 mt-1">Persons</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {totalFaces}
            </div>
            <div className="text-xs text-gray-500 mt-1">Faces</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
            <div className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent truncate">
              {recognitionBackend}
            </div>
            <div className="text-xs text-gray-500 mt-1">Model</div>
          </div>
        </div>
      </div>

      {/* Annotated Image */}
      {annotatedImage && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h4 className="text-sm font-medium text-gray-300">
                YOLO Detection
              </h4>
            </div>
            <img
              src={`data:image/jpeg;base64,${annotatedImage}`}
              alt="Annotated"
              className="w-full rounded-xl ring-1 ring-white/10"
            />
          </div>
        </div>
      )}

      {/* Person Cards */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Detected Individuals
        </h4>

        {results.map((person) => (
          <div key={person.person_id} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300" />
            <div className="relative rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {person.person_id + 1}
                          </div>
                          <div>
                            <h5 className="text-white font-medium">
                              {person.name ? person.name : `Person ${person.person_id + 1}`}
                            </h5>
                            <p className="text-xs text-gray-500">
                              Confidence: {person.face_confidence !== undefined && person.face_confidence !== null
                                ? (person.face_confidence <= 1 ? (person.face_confidence * 100).toFixed(1) : Number(person.face_confidence).toFixed(1))
                                : (person.person_confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs">
                    {person.faces.length} face
                    {person.faces.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Person thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={`data:image/jpeg;base64,${person.person_image}`}
                      alt={`Person ${person.person_id + 1}`}
                      className="w-24 h-32 object-cover rounded-lg ring-1 ring-white/10"
                    />
                  </div>

                  {/* Faces */}
                  <div className="flex-1 space-y-3">
                    {person.faces.length > 0 ? (
                      person.faces.map((face, faceIdx) => {
                        const recognition = face.recognition ?? null;
                        const displayName = recognition?.name ?? person.name ?? null;

                        // compute a progress percentage in a defensive way
                        let pct = 0;
                        if (recognition && recognition.distance !== undefined && recognition.distance !== null) {
                          const d = Number(recognition.distance);
                          if (!Number.isNaN(d)) {
                            pct = d <= 1 ? Math.max(0, Math.min(100, (1 - d) * 100)) : Math.max(0, Math.min(100, d));
                          }
                        } else if (person.face_confidence !== undefined && person.face_confidence !== null) {
                          const pc = Number(person.face_confidence);
                          if (!Number.isNaN(pc)) {
                            pct = pc <= 1 ? Math.max(0, Math.min(100, pc * 100)) : Math.max(0, Math.min(100, pc));
                          }
                        }

                        return (
                          <div
                            key={faceIdx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                          >
                            <img
                              src={`data:image/jpeg;base64,${face.face_image}`}
                              alt={`Face ${faceIdx + 1}`}
                              className="w-14 h-14 object-cover rounded-lg ring-1 ring-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              {displayName ? (
                                <>
                                  <p className="font-medium text-white truncate">{displayName}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">{Math.round(pct)}%</span>
                                  </div>
                                  {recognition?.message && (
                                    <p className="text-xs text-amber-400 mt-1">{recognition.message}</p>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm text-gray-500">No match found</p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">
                          {person.error || "No faces detected"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
