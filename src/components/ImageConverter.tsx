import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";

interface ImageConverterProps {
  image: string;
  imageFile: File | null;
  originalDimensions: { width: number; height: number } | null;
  onReset: () => void;
}

const OUTPUT_FORMATS = [
  { value: "jpeg", label: "JPG", mime: "image/jpeg" },
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "webp", label: "WEBP", mime: "image/webp" },
  { value: "bmp", label: "BMP", mime: "image/bmp" },
];

export const ImageConverter = ({ image, imageFile, originalDimensions, onReset }: ImageConverterProps) => {
  const [outputFormat, setOutputFormat] = useState<string>("png");

  const handleConvert = async () => {
    if (!image) return;

    try {
      const img = document.createElement('img');
      img.src = image;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          toast.error("Error al procesar la imagen");
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        const format = OUTPUT_FORMATS.find(f => f.value === outputFormat);
        if (!format) return;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error("Error al convertir la imagen");
              return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `imagen-convertida.${format.value}`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success(`Imagen convertida a ${format.label}`);
          },
          format.mime,
          0.95
        );
      };
    } catch (error) {
      toast.error("Error al convertir la imagen");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Imagen Original
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img src={image} alt="Original" className="w-full rounded-lg mb-4" />
          {originalDimensions && (
            <p className="text-sm text-muted-foreground">
              Tamaño original: {originalDimensions.width} x {originalDimensions.height} px
            </p>
          )}
          {imageFile && (
            <p className="text-sm text-muted-foreground">
              Formato original: {imageFile.type.split('/')[1].toUpperCase()}
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
            <label className="text-sm font-medium mb-2 block">Formato de salida</label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_FORMATS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleConvert} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Convertir y Descargar
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
