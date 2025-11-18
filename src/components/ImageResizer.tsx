import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";

interface ImageResizerProps {
  image: string;
  originalDimensions: { width: number; height: number } | null;
  onReset: () => void;
}

export const ImageResizer = ({ image, originalDimensions, onReset }: ImageResizerProps) => {
  const [width, setWidth] = useState<number>(originalDimensions?.width || 0);
  const [height, setHeight] = useState<number>(originalDimensions?.height || 0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [percentage, setPercentage] = useState<number>(100);
  const [usePercentage, setUsePercentage] = useState(false);

  useEffect(() => {
    if (originalDimensions) {
      setWidth(originalDimensions.width);
      setHeight(originalDimensions.height);
    }
  }, [originalDimensions]);

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (maintainAspect && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(value * ratio));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (maintainAspect && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(value * ratio));
    }
  };

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    if (originalDimensions) {
      const factor = value / 100;
      setWidth(Math.round(originalDimensions.width * factor));
      setHeight(Math.round(originalDimensions.height * factor));
    }
  };

  const applyPreset = (preset: number) => {
    handlePercentageChange(preset);
  };

  const handleResize = () => {
    if (!image) return;

    const img = document.createElement('img');
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Error al procesar la imagen");
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Error al redimensionar la imagen");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `imagen-redimensionada-${width}x${height}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Imagen redimensionada a ${width}x${height}px`);
      });
    };
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Vista Previa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img src={image} alt="Preview" className="w-full rounded-lg mb-4" />
          {originalDimensions && (
            <p className="text-sm text-muted-foreground">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="aspect-ratio">Mantener relación de aspecto</Label>
            <Switch
              id="aspect-ratio"
              checked={maintainAspect}
              onCheckedChange={setMaintainAspect}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="use-percentage">Usar porcentaje</Label>
            <Switch
              id="use-percentage"
              checked={usePercentage}
              onCheckedChange={setUsePercentage}
            />
          </div>

          {usePercentage ? (
            <>
              <div>
                <Label htmlFor="percentage">Porcentaje</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={percentage}
                  onChange={(e) => handlePercentageChange(Number(e.target.value))}
                  min={1}
                  max={500}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => applyPreset(25)}>
                  25%
                </Button>
                <Button variant="outline" onClick={() => applyPreset(50)}>
                  50%
                </Button>
                <Button variant="outline" onClick={() => applyPreset(75)}>
                  75%
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="width">Ancho (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="height">Alto (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                />
              </div>
            </>
          )}

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">Nuevo tamaño</p>
            <p className="text-sm text-muted-foreground">
              {width} x {height} px
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleResize} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Redimensionar y Descargar
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
