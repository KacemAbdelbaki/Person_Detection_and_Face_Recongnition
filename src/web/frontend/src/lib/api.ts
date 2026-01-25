import { RecognitionResponse, BackendsResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getBackends(): Promise<BackendsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/backends`);
  if (!response.ok) {
    throw new Error("Failed to fetch backends");
  }
  return response.json();
}

export async function recognizeFaces(
  imageBase64: string,
  recognitionBackend: string,
  detectorBackend: string,
): Promise<RecognitionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/recognize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      recognition_backend: recognitionBackend,
      detector_backend: detectorBackend,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Recognition failed");
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
