import os
import io
import urllib.request
from pathlib import Path
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Masque INFO (1) et WARNING (2)
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.vgg16 import preprocess_input as vgg16_preprocess

app = FastAPI()

# ---------------------------------------------------------
# 1. Configuration CORS
# ---------------------------------------------------------
# Permet à votre frontend (Vercel ou local) de communiquer avec Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, vous pourrez remplacer "*" par votre domaine Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASS_NAMES = ["Éosinophile", "Lymphocyte", "Monocyte", "Neutrophile"]

# ---------------------------------------------------------
# 2. Gestion et téléchargement du modèle depuis Hugging Face
# ---------------------------------------------------------
# URL brute pour télécharger directement le fichier model.h5
HF_MODEL_URL = "https://huggingface.co/mohammedChak/ClassificationCellulesSanguines/resolve/main/model/model.h5"

BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "model.h5"

model = None

@app.on_event("startup")
async def load():
    global model
    try:
        # Créer le dossier 'model' s'il n'existe pas
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        
        # Télécharger le modèle depuis Hugging Face s'il n'est pas présent
        if not MODEL_PATH.exists():
            print(f"📥 Téléchargement du modèle depuis Hugging Face...")
            urllib.request.urlretrieve(HF_MODEL_URL, str(MODEL_PATH))
            print("✅ Téléchargement terminé !")
        
        # Chargement du modèle Keras
        model = load_model(str(MODEL_PATH))
        print(f"✅ Modèle chargé avec succès : {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Erreur lors du chargement du modèle : {e}")

# ---------------------------------------------------------
# 3. Endpoints de l'API
# ---------------------------------------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(503, "Modèle non disponible")

    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        
        arr = np.array(img, dtype=np.float32)
        arr = np.expand_dims(arr, axis=0)

        # Prétraitement spécifique VGG16
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
    except Exception as e:
        raise HTTPException(500, f"Erreur lors du traitement de l'image : {str(e)}")

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}