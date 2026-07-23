from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
from pathlib import Path
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.vgg16 import preprocess_input as vgg16_preprocess

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = ["Éosinophile", "Lymphocyte", "Monocyte", "Neutrophile"]

# Chemin absolu basé sur l'emplacement de main.py
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR.parent / "model" / "model.h5"

model = None

@app.on_event("startup")
async def load():
    global model
    if not MODEL_PATH.exists():
        print(f"❌ Fichier introuvable : {MODEL_PATH}")
        return
    try:
        model = load_model(str(MODEL_PATH))
        print(f"✅ Modèle chargé : {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Erreur chargement modèle : {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(503, "Modèle non disponible")

    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)

    # IMPORTANT : Il faut nécessairement appeller preprocess_input de resnet50
    arr = vgg16_preprocess(arr)

    predictions = model.predict(arr, verbose=0)[0]
    predicted_index = int(np.argmax(predictions))
    confidence = float(predictions[predicted_index])

    top3_indices = np.argsort(predictions)[::-1][:3]
    top3 = [
        {
            "class": CLASS_NAMES[i] if i < len(CLASS_NAMES) else f"Classe {i}",
            "confidence": round(float(predictions[i]) * 100, 2),
        }
        for i in top3_indices
    ]

    return JSONResponse({
        "predicted_class": CLASS_NAMES[predicted_index],
        "confidence": round(confidence * 100, 2),
        "top3": top3,
    })

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}