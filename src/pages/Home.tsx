import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageUpload } from '@/components/features/ImageUpload';
import { OptionSelector } from '@/components/features/OptionSelector';
import { ColorSelector } from '@/components/features/ColorSelector';
import { ResultDisplay } from '@/components/features/ResultDisplay';
import type { PhotoOptions, GeneratedPhoto, PhotoType, BackgroundColor, AspectRatio } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<PhotoOptions>({
    photoType: 'half-body',
    backgroundColor: 'white',
    aspectRatio: '3:4',
  });
  const [generatedPhoto, setGeneratedPhoto] = useState<GeneratedPhoto | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelect = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setUploadedFile(null);
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-id-photo', {
        body: {
          image: uploadedImage,
          photoType: options.photoType,
          backgroundColor: options.backgroundColor,
          aspectRatio: options.aspectRatio,
        },
      });

      if (error) {
        console.error('Generation error:', error);
        throw new Error(error.message || 'Failed to generate ID photo');
      }

      if (data?.imageUrl) {
        const newPhoto: GeneratedPhoto = {
          id: crypto.randomUUID(),
          url: data.imageUrl,
          timestamp: Date.now(),
          options: { ...options },
        };
        setGeneratedPhoto(newPhoto);
        toast.success('ID photo generated successfully!');
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to generate ID photo');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Side - Upload & Options */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <ImageUpload
                image={uploadedImage}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
              />

              <div className="mt-6 space-y-4">
                <OptionSelector
                  title="Photo Type"
                  options={[
                    { value: 'full-body', label: 'Full-body' },
                    { value: 'half-body', label: 'Half-body' },
                  ]}
                  selected={options.photoType}
                  onSelect={(value) => setOptions({ ...options, photoType: value as PhotoType })}
                />

                <ColorSelector
                  selected={options.backgroundColor}
                  onSelect={(color) => setOptions({ ...options, backgroundColor: color })}
                />

                <OptionSelector
                  title="Aspect Ratio"
                  options={[
                    { value: '4:3', label: '4:3' },
                    { value: '3:4', label: '3:4' },
                  ]}
                  selected={options.aspectRatio}
                  onSelect={(value) => setOptions({ ...options, aspectRatio: value as AspectRatio })}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || isGenerating}
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generating...' : 'Generate ID Photo'}
              </button>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <ResultDisplay photo={generatedPhoto} isGenerating={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}
