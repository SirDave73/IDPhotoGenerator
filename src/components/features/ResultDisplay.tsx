import { Download, Loader2 } from 'lucide-react';
import type { GeneratedPhoto } from '@/types';

interface ResultDisplayProps {
  photo: GeneratedPhoto | null;
  isGenerating: boolean;
}

export function ResultDisplay({ photo, isGenerating }: ResultDisplayProps) {
  const handleDownload = () => {
    if (!photo) return;

    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `id-photo-${photo.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Generated Result</h2>
        {photo && !isGenerating && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download</span>
          </button>
        )}
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Generating your ID photo...</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
            </div>
          </div>
        ) : photo ? (
          <img
            src={photo.url}
            alt="Generated ID Photo"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center px-6">
            <p className="text-sm text-muted-foreground">Your generated ID photo will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
