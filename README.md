# Person Detection and Face Recognition

Project combining YOLO-based person/face detection with DeepFace and RetinaFace for face extraction and recognition. Useful for building and evaluating face retrieval and detection workflows on a small labeled dataset of celebrity faces.

## Features
- Detect people/faces using the provided YOLO model and RetinaFace.
- Extract faces and match against a local face database using DeepFace.
- Evaluation notebooks for YOLO and DeepFace included.

## Quick Setup
1. Create and activate a Python 3.8+ virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage
- Open and run the main pipeline notebook: [src/main.ipynb](src/main.ipynb)
- Evaluation notebooks:
  - [eval/deepface_eval/DeepFace_Evaluation.ipynb](eval/deepface_eval/DeepFace_Evaluation.ipynb)
  - [eval/yolo_eval_Data/Yolo_Evaluation.ipynb](eval/yolo_eval_Data/Yolo_Evaluation.ipynb)

Notes: adjust file paths in notebooks if running from a different working directory. Some DeepFace calls set `enforce_detection=False` to allow recognition on pre-cropped faces.

## Repository Structure
- [requirements.txt](requirements.txt)
- [src/main.ipynb](src/main.ipynb) — main demo pipeline using YOLO, DeepFace, RetinaFace
- [src/yolo11n.pt](src/yolo11n.pt) — YOLO model used in examples
- [eval/yolo_eval_Data/yolo11n.pt](eval/yolo_eval_Data/yolo11n.pt) — evaluation copy of YOLO model
- [eval/deepface_eval/DeepFace_Evaluation.ipynb](eval/deepface_eval/DeepFace_Evaluation.ipynb)
- [eval/yolo_eval_Data/Yolo_Evaluation.ipynb](eval/yolo_eval_Data/Yolo_Evaluation.ipynb)
- [img/data](img/data) — prepared dataset folders (train/test)
- [img/test_images](img/test_images) — example test images
- [raw_data](raw_data) — raw downloaded images organized as `pins_<name>` directories for each identity

## Models & Backends
- YOLO: local `yolo11n.pt` (ultralytics YOLO wrapper used in notebooks).
- Face detection/backends used: `retinaface` (RetinaFace), DeepFace detector backends (e.g., `opencv`, `retinaface`, custom YOLO-based detectors).

## Running locally
1. Start Jupyter Lab / Notebook in the project root:

```bash
jupyter lab
```

2. Open and run `src/main.ipynb`. If you only want to run detection, run the YOLO cells; for face matching run the DeepFace cells.

## Troubleshooting
- If a model import fails, ensure the virtual environment uses a compatible Python version and the packages in `requirements.txt` installed correctly.
- Paths in notebooks are relative; adjust `test_image`, `db_path`, and model paths if needed.

## License
This repository has no attached license. Use and modify at your own risk.

## Contact
For questions about running the notebooks, open an issue or contact the repository owner.
