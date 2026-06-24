// services/home.js
// Responsabilité : toutes les requêtes vers FastAPI

import BASE_URL from "./backend_client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_MB = 10;

/**
 * Valide le fichier image avant envoi.
 * Retourne un message d'erreur ou null si valide.
 */
export function validateImage(file) {
  if (!file) return "Aucun fichier sélectionné.";
  if (!ALLOWED_TYPES.includes(file.type))
    return "Format non supporté. Utilisez JPEG ou PNG.";
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`;
  return null;
}

/**
 * Envoie l'image au backend et retourne la prédiction.
 * { predicted_class, confidence, top3 }
 */
export async function predictImage(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let detail = "Erreur serveur.";
    try {
      const err = await response.json();
      detail = err.detail || detail;
    } catch (_) {}
    throw new Error(detail);
  }

  return response.json();
}

/**
 * Vérifie que le backend est en ligne.
 * { status: "ok", model_loaded: true }
 */
export async function checkHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error("Backend inaccessible.");
  return response.json();
}