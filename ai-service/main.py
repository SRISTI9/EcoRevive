
from io import BytesIO
from functools import lru_cache

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from transformers import pipeline

app = FastAPI(title="EcoRevive Computer Vision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MAX_IMAGE_SIZE = 5 * 1024 * 1024

DAMAGE_LABELS = [
    "an electronic device with a cracked screen",
    "an electronic device with scratches on its body",
    "an electronic device with dents or physical damage",
    "an electronic device with a broken or shattered display",
    "an electronic device in good physical condition with no visible damage",
]


@lru_cache(maxsize=1)
def get_model():
    return pipeline(
        task="zero-shot-image-classification",
        model="openai/clip-vit-base-patch32",
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "EcoRevive Computer Vision",
    }


@app.post("/analyze")
async def analyze_device(file: UploadFile = File(...)):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail="Upload a JPG, PNG, or WEBP image.",
        )

    content = await file.read(MAX_IMAGE_SIZE + 1)

    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be 5 MB or smaller.",
        )

    try:
        image = Image.open(BytesIO(content)).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    try:
        predictions = get_model()(
            image,
            candidate_labels=DAMAGE_LABELS,
        )
    except Exception as exc:
        print("Model inference failed:", str(exc))
        raise HTTPException(
            status_code=503,
            detail="Image analysis failed. Please try again.",
        )

    results = [
        {
            "label": item["label"],
            "confidence": round(float(item["score"]), 4),
        }
        for item in predictions
    ]

    return {
        "model": "openai/clip-vit-base-patch32",
        "task": "zero-shot image classification",
        "topPrediction": results[0],
        "predictions": results,
        "disclaimer": (
            "This is experimental image classification. "
            "The confidence score is not a validated probability "
            "of damage. Please inspect the device before making "
            "a repair or recycling decision."
        ),
    }
