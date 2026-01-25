export interface FacialArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Recognition {
  name: string;
  identity?: string;
  distance?: number;
  model_used?: string;
  message?: string;
}

export interface FaceResult {
  facial_area: FacialArea;
  face_confidence: number;
  face_image: string;
  recognition: Recognition | null;
  recognition_error?: string;
}

export interface PersonBbox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PersonResult {
  person_id: number;
  person_bbox: PersonBbox;
  person_confidence: number;
  person_image: string;
  faces: FaceResult[];
  error?: string;
}

export interface RecognitionResponse {
  success: boolean;
  persons_detected: number;
  recognition_backend: string;
  detector_backend: string;
  results: PersonResult[];
  annotated_image: string;
  error?: string;
}

export interface BackendsResponse {
  recognition_backends: string[];
  detector_backends: string[];
}
