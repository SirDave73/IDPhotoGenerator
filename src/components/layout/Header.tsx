import { Camera } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2">
            <Camera className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI ID Photo Generator</h1>
            <p className="text-sm text-muted-foreground">Transform photos into professional ID images</p>
          </div>
        </div>
      </div>
    </header>
  );
}
