"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CAMERA_CONFIG } from "@/lib/constants";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'API getUserMedia n'est pas supportée par ce navigateur");
      }

      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: CAMERA_CONFIG,
        });
      } catch (err) {
        // Fallback: config simple si la config avancée échoue
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      }

      streamRef.current = stream;
      // Set active first so the <video> element mounts in the DOM
      setIsActive(true);
    } catch (err: any) {
      let errorMessage = "Impossible d'accéder à la caméra.";

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permission refusée. Autorisez l'accès à la caméra.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "Aucune caméra trouvée sur cet appareil.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Caméra déjà utilisée par une autre application.";
      }

      setError(errorMessage);
      setIsActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  // Assign stream to video element once it's mounted
  useEffect(() => {
    if (isActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Erreur play():", err);
      });
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, isActive, error, startCamera, stopCamera, captureFrame };
}
