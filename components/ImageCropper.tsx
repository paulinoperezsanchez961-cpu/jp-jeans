import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, aspectRatio, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Función matemática que corta la imagen real usando un Canvas invisible
  const generarRecorte = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Devuelve la imagen recortada en formato Base64 para vista previa inmediata
      const base64Image = canvas.toDataURL('image/jpeg');
      onCropComplete(base64Image);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg overflow-hidden flex flex-col h-[80vh]">
        
        {/* Cabecera del Editor */}
        <div className="p-4 bg-black text-white flex justify-between items-center">
          <h3 className="text-xs font-bold tracking-widest uppercase">Ajuste Perfecto de Imagen</h3>
          <button onClick={onCancel} className="text-white hover:text-red-500">✕ Cerrar</button>
        </div>

        {/* Área Interactiva de Recorte */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controles de Zoom y Guardado */}
        <div className="p-6 bg-white flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-500">ZOOM</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-black"
            />
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <button onClick={onCancel} className="px-6 py-3 text-xs font-bold tracking-widest uppercase border border-black hover:bg-gray-100">
              Cancelar
            </button>
            <button onClick={generarRecorte} className="px-6 py-3 text-xs font-bold tracking-widest uppercase bg-black text-white hover:bg-gray-800">
              Aplicar Recorte Exacto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}