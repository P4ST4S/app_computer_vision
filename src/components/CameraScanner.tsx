"use client";

import { Camera, CameraOff, ScanLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { useState } from "react";

interface CameraScannerProps {
  onScan: (imageData: string) => void;
  isScanning: boolean;
}

const CameraScanner = ({ onScan, isScanning }: CameraScannerProps) => {
  const { videoRef, isActive, error, startCamera, stopCamera, captureFrame } = useCamera();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleScan = () => {
    const frame = captureFrame();
    if (frame) {
      setShowOverlay(true);
      onScan(frame);
      setTimeout(() => setShowOverlay(false), 1500);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md px-5">
      {/* Camera viewport */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))]" style={{ aspectRatio: "3/4" }}>
        {isActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Scanner overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-48 w-48 sm:h-56 sm:w-56">
                {/* Corner markers */}
                <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-[3px] border-t-[3px] border-[hsl(var(--color-primary))]" />
                <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-[3px] border-t-[3px] border-[hsl(var(--color-primary))]" />
                <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-[3px] border-l-[3px] border-[hsl(var(--color-primary))]" />
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-[3px] border-r-[3px] border-[hsl(var(--color-primary))]" />
                {/* Scan line animation */}
                {isScanning && (
                  <div className="scan-line absolute left-2 right-2 top-0 h-0.5 bg-[hsl(var(--color-primary))] shadow-[0_0_8px_hsl(var(--scanner-glow))]" />
                )}
              </div>
            </div>
            {/* Flash overlay on scan */}
            {showOverlay && (
              <div className="absolute inset-0 animate-pulse bg-[hsl(var(--color-primary))]/20" />
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--color-secondary))]">
              <Camera className="h-10 w-10 text-[hsl(var(--color-muted-foreground))]" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-[hsl(var(--color-foreground))]">
                Activez la caméra
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--color-muted-foreground))]">
                Pointez votre caméra vers un aliment pour scanner ses nutriments
              </p>
            </div>
            {error && (
              <p className="rounded-lg bg-[hsl(var(--color-destructive))]/10 px-3 py-2 text-sm text-[hsl(var(--color-destructive))]">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {!isActive ? (
          <Button
            onClick={startCamera}
            size="lg"
            className="w-full gap-2 rounded-2xl py-6 font-heading text-base font-semibold"
          >
            <Camera className="h-5 w-5" />
            Activer la caméra
          </Button>
        ) : (
          <>
            <Button
              onClick={stopCamera}
              variant="outline"
              size="icon"
              className="h-14 w-14 shrink-0 rounded-2xl"
            >
              <CameraOff className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleScan}
              disabled={isScanning}
              size="lg"
              className="flex-1 gap-2 rounded-2xl py-6 font-heading text-base font-semibold scanner-pulse"
            >
              {isScanning ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ScanLine className="h-5 w-5" />
              )}
              {isScanning ? "Analyse..." : "Scanner"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraScanner;
