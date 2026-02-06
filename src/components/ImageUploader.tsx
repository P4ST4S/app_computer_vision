"use client";

import { Upload, Loader2, Image as ImageIcon, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface ImageUploaderProps {
  onUpload: (imageData: string) => void;
  isProcessing: boolean;
}

const ImageUploader = ({ onUpload, isProcessing }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale: 10 MB');
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      if (imageData) {
        setSelectedImage(imageData);
      }
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      onUpload(selectedImage);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
  };

  return (
    <div className="relative mx-auto w-full max-w-md px-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Upload area */}
      <div className={`relative overflow-hidden rounded-3xl border-2 border-dashed border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))] ${selectedImage ? '' : 'aspect-[3/4]'}`}>
        {selectedImage ? (
          <>
            {/* Preview image */}
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full object-contain"
              style={{ maxHeight: '70vh' }}
            />
            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <p className="font-heading text-base font-semibold">Analyse en cours...</p>
                </div>
              </div>
            )}
            {/* Clear button */}
            {!isProcessing && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--color-secondary))]">
              <ImageIcon className="h-10 w-10 text-[hsl(var(--color-muted-foreground))]" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-[hsl(var(--color-foreground))]">
                Importer une image
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--color-muted-foreground))]">
                Sélectionnez une photo d&apos;un aliment depuis votre appareil
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center justify-center gap-3">
        {selectedImage ? (
          <>
            <Button
              onClick={triggerFileUpload}
              disabled={isProcessing}
              variant="outline"
              size="icon"
              className="h-14 w-14 shrink-0 rounded-2xl"
            >
              <Upload className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isProcessing}
              size="lg"
              className="flex-1 gap-2 rounded-2xl py-6 font-heading text-base font-semibold scanner-pulse"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ScanLine className="h-5 w-5" />
              )}
              {isProcessing ? "Analyse..." : "Analyser"}
            </Button>
          </>
        ) : (
          <Button
            onClick={triggerFileUpload}
            disabled={isProcessing}
            size="lg"
            className="w-full gap-2 rounded-2xl py-6 font-heading text-base font-semibold"
          >
            <Upload className="h-5 w-5" />
            Sélectionner une image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
