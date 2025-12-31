import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploadProps {
  image: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageUpload({ image, onImageSelect, onImageRemove }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Upload Photo</h2>
      <div
        onClick={!image ? handleClick : undefined}
        className={`relative bg-card border-2 border-dashed border-border rounded-lg overflow-hidden transition-all ${
          !image ? 'cursor-pointer hover:border-primary hover:bg-accent' : ''
        }`}
        style={{ aspectRatio: image ? 'auto' : '4/3' }}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-auto object-contain"
            />
            <button
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-background/90 hover:bg-background rounded-full p-1.5 shadow-lg transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <div className="bg-primary/10 rounded-full p-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
