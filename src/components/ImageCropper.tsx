import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  image: string;
  originalDimensions: { width: number; height: number } | null;
  onReset: () => void;
}

export const ImageCropper = ({ image, originalDimensions, onReset }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    x: 0,
    y: 0,
    width: originalDimensions?.width || 100,
    height: originalDimensions?.height || 100,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const handleCropWidthChange = (value: number) => {
    setCrop((prev) => ({ ...prev, width: value }));
  };

  const handleCropHeightChange = (value: number) => {
    setCrop((prev) => ({ ...prev, height: value }));
  };

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error("Por favor, selecciona un área para recortar");
      return;
    }

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Error al procesar la imagen");
      return;
    }

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Error al recortar la imagen");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `imagen-recortada-${completedCrop.width}x${completedCrop.height}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Imagen recortada correctamente");
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Recortar Imagen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop"
              className="max-w-full rounded-lg"
            />
          </ReactCrop>
          {originalDimensions && (
            <p className="text-sm text-muted-foreground mt-4">
              Tamaño original: {originalDimensions.width} x {originalDimensions.height} px
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="crop-width">Ancho del recorte (px)</Label>
            <Input
              id="crop-width"
              type="number"
              value={Math.round(crop.width || 0)}
              onChange={(e) => handleCropWidthChange(Number(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <Label htmlFor="crop-height">Alto del recorte (px)</Label>
            <Input
              id="crop-height"
              type="number"
              value={Math.round(crop.height || 0)}
              onChange={(e) => handleCropHeightChange(Number(e.target.value))}
              min={1}
            />
          </div>

          {completedCrop && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">Área seleccionada</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(completedCrop.width)} x {Math.round(completedCrop.height)} px
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Posición: X: {Math.round(completedCrop.x)}, Y: {Math.round(completedCrop.y)}
              </p>
            </div>
          )}

          <div className="bg-accent/50 p-3 rounded-lg border border-accent">
            <p className="text-xs text-muted-foreground">
              💡 Arrastra el marco para ajustar el área de recorte. Usa los controles para cambiar el tamaño manualmente.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCrop} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Recortar y Descargar
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
