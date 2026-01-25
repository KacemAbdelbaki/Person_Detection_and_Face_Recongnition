"""
Flask Backend for Face Recognition Pipeline
Uses YOLO for person detection and DeepFace for face recognition
"""

import os
import io
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from deepface import DeepFace
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load YOLO model globally
yolo_model = YOLO("yolo11n.pt")

# Available DeepFace backends
AVAILABLE_BACKENDS = [
    "VGG-Face",
    "Facenet",
    "Facenet512",
    "OpenFace",
    "DeepFace",
    "ArcFace"
]

# Available detector backends
DETECTOR_BACKENDS = [
    "opencv",
    "retinaface",
    "mediapipe",
    "yolov11n"
]


def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode base64 image to numpy array"""
    # Remove data URL prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    
    image_bytes = base64.b64decode(base64_string)
    image = Image.open(io.BytesIO(image_bytes))
    return cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)


def encode_image_to_base64(image: np.ndarray) -> str:
    """Encode numpy array image to base64 string"""
    _, buffer = cv2.imencode('.jpg', image)
    return base64.b64encode(buffer).decode('utf-8')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Backend is running"})


@app.route('/api/backends', methods=['GET'])
def get_backends():
    """Return available DeepFace recognition backends"""
    return jsonify({
        "recognition_backends": AVAILABLE_BACKENDS,
        "detector_backends": DETECTOR_BACKENDS
    })


@app.route('/api/recognize', methods=['POST'])
def recognize_faces():
    """
    Main endpoint for face recognition pipeline
    1. Receives image and selected backend
    2. Uses YOLO to detect persons
    3. Extracts faces using DeepFace
    4. Performs face recognition with selected backend
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Get parameters
        base64_image = data['image']
        recognition_backend = data.get('recognition_backend', 'VGG-Face')
        detector_backend = data.get('detector_backend', 'opencv')
        db_path = data.get('db_path', './data/test')
        
        # Validate backend
        if recognition_backend not in AVAILABLE_BACKENDS:
            return jsonify({
                "error": f"Invalid recognition backend. Available: {AVAILABLE_BACKENDS}"
            }), 400
        
        # Decode image
        image = decode_base64_image(base64_image)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Step 1: YOLO Person Detection
        results = []

        yolo_results = yolo_model(image_rgb, classes=[0])  # class 0 = person
        boxes = yolo_results[0].boxes.xyxy.detach().cpu().numpy()
        confidences = yolo_results[0].boxes.conf.detach().cpu().numpy()
        
        persons_detected = []
        for i, (box, conf) in enumerate(zip(boxes, confidences)):
            x1, y1, x2, y2 = map(int, box)
            cropped_person = image_rgb[y1:y2, x1:x2]

            # extract faces from the cropped person image
            extracted_face = DeepFace.extract_faces(
                cropped_person,
                detector_backend=detector_backend,
                enforce_detection=False,
            )

            if not extracted_face:
                persons_detected.append({
                    "person_id": i,
                    "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "confidence": float(conf),
                    "image": cv2.cvtColor(cropped_person, cv2.COLOR_RGB2BGR),
                })
                continue

            max_confidence_face = (
                max(extracted_face, key=lambda f: f.get("confidence", 0.0))
                if isinstance(extracted_face, list)
                else extracted_face
            )

            print(f"Max confidence face: {max_confidence_face.get('confidence')}")

            img_with_boxes = cropped_person.copy()

            facial_area = max_confidence_face.get("facial_area", {})
            x, y, w, h = (
                int(facial_area.get("x", 0)),
                int(facial_area.get("y", 0)),
                int(facial_area.get("w", 0)),
                int(facial_area.get("h", 0)),
            )

            img_h, img_w = cropped_person.shape[:2]
            x = max(0, min(x, img_w - 1))
            y = max(0, min(y, img_h - 1))
            w = max(0, min(w, img_w - x))
            h = max(0, min(h, img_h - y))

            face = cropped_person[y : y + h, x : x + w]
            cv2.rectangle(img_with_boxes, (x, y), (x + w, y + h), (0, 255, 0), 2)

            find_results = DeepFace.find(
                face,
                db_path=db_path,
                model_name=recognition_backend,
                detector_backend=detector_backend,
                enforce_detection=False,
            )

            match = None
            if find_results and isinstance(find_results, list) and len(find_results) > 0:
                df = find_results[0]
                try:
                    if not df.empty:
                        identity_path = df["identity"].iloc[0]
                        identity_path = os.path.normpath(identity_path)
                        match_name = os.path.basename(os.path.dirname(identity_path))
                        match_name = match_name.replace("pins_", "")
                        confidence = df["confidence"].iloc[0] if "confidence" in df.columns else None
                        match = {"name": match_name, "distance": float(confidence) if confidence is not None else None}
                except Exception:
                    match = None

            result_name = match.get("name") if match else None
            result_conf = match.get("distance") if match else None

            results.append(
                {
                    "person_id": i,
                    "person_bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "person_confidence": float(conf),
                    "person_image": encode_image_to_base64(cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR)),
                    "faces": [
                        {
                            "face_image": encode_image_to_base64(cv2.cvtColor(face, cv2.COLOR_RGB2BGR)),
                            "recognition": match,
                        }
                    ],
                    "name": result_name,
                    "face_confidence": float(result_conf) if result_conf is not None else None,
                }
            )

            persons_detected.append(
                {
                    "person_id": i,
                    "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "confidence": float(conf),
                    "image": cv2.cvtColor(cropped_person, cv2.COLOR_RGB2BGR),
                }
            )
            
        # Create annotated image
        annotated_image = image_rgb.copy()
        for person in persons_detected:
            bbox = person["bbox"]
            cv2.rectangle(
                annotated_image,
                (bbox["x1"], bbox["y1"]),
                (bbox["x2"], bbox["y2"]),
                (0, 255, 0), 2
            )
            cv2.putText(
                annotated_image,
                f"Person {person['person_id'] + 1}",
                (bbox["x1"], bbox["y1"] - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2
            )
        
        return jsonify({
            "success": True,
            "persons_detected": len(persons_detected),
            "recognition_backend": recognition_backend,
            "detector_backend": detector_backend,
            "results": results,
            "annotated_image": encode_image_to_base64(cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR))
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_face():
    """
    Analyze a single face for attributes (age, gender, emotion, race)
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        base64_image = data['image']
        detector_backend = data.get('detector_backend', 'opencv')
        
        image = decode_base64_image(base64_image)
        
        # Analyze face attributes
        analysis = DeepFace.analyze(
            image,
            actions=['age', 'gender', 'emotion', 'race'],
            detector_backend=detector_backend,
            enforce_detection=False,
            silent=True
        )
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    # Ensure data directory exists
    os.makedirs('./data/test', exist_ok=True)
    
    print("Starting Face Recognition Backend...")
    print(f"Available recognition backends: {AVAILABLE_BACKENDS}")
    print(f"Available detector backends: {DETECTOR_BACKENDS}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
