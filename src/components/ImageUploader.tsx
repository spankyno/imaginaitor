import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
}

const ACCEPTED_FORMATS = {
  "image/bmp": [".bmp"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/svg+xml": [".svg"],
  "image/gif": [".gif"],
  "image/tiff": [".tiff", ".tif"],
};

export const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        toast.error("Formato de archivo no soportado");
        return;
      }

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        onImageUpload(file, dataUrl);
        toast.success("Imagen cargada correctamente");
      };

      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    multiple: false,
    maxSize: 10485760, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-primary bg-primary/5 scale-105"
          : "border-border hover:border-primary hover:bg-accent/50"
      }`}
      style={{ boxShadow: isDragActive ? "var(--shadow-glow)" : "none" }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="w-16 h-16 text-primary animate-bounce" />
        ) : (
          <ImageIcon className="w-16 h-16 text-muted-foreground" />
        )}
        <div>
          <p className="text-xl font-semibold mb-2">
            {isDragActive ? "Suelta la imagen aquí" : "Arrastra tu imagen aquí"}
          </p>
          <p className="text-muted-foreground mb-4">
            o haz clic para seleccionar un archivo
          </p>
          <p className="text-sm text-muted-foreground">
            Formatos soportados: BMP, JPG, PNG, SVG, GIF, TIFF
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tamaño máximo: 10MB
          </p>
        </div>
      </div>
    </div>
  );
};
