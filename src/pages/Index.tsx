import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageConverter } from "@/components/ImageConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { ImageCropper } from "@/components/ImageCropper";
import { Image, Scissors, Maximize2 } from "lucide-react";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImageFile(file);
    setUploadedImage(dataUrl);
    
    const img = document.createElement('img');
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
    };
    img.src = dataUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Imaginaitor
          </h1>
          <p className="text-muted-foreground text-lg">
            Editor de imágenes profesional online
          </p>
        </header>

        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="convert" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="convert" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Convertir
                </TabsTrigger>
                <TabsTrigger value="resize" className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  Redimensionar
                </TabsTrigger>
                <TabsTrigger value="crop" className="flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Recortar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="convert">
                <ImageConverter
                  image={uploadedImage}
                  imageFile={imageFile}
                  originalDimensions={originalDimensions}
                  onReset={() => {
                    setUploadedImage(null);
                    setImageFile(null);
                    setOriginalDimensions(null);
                  }}
                />
              </TabsContent>

              <TabsContent value="resize">
                <ImageResizer
                  image={uploadedImage}
                  originalDimensions={originalDimensions}
                  onReset={() => {
                    setUploadedImage(null);
                    setImageFile(null);
                    setOriginalDimensions(null);
                  }}
                />
              </TabsContent>

              <TabsContent value="crop">
                <ImageCropper
                  image={uploadedImage}
                  originalDimensions={originalDimensions}
                  onReset={() => {
                    setUploadedImage(null);
                    setImageFile(null);
                    setOriginalDimensions(null);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
