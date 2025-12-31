export type PhotoType = 'full-body' | 'half-body';
export type BackgroundColor = 'white' | 'gray' | 'blue';
export type AspectRatio = '4:3' | '3:4';

export interface PhotoOptions {
  photoType: PhotoType;
  backgroundColor: BackgroundColor;
  aspectRatio: AspectRatio;
}

export interface GeneratedPhoto {
  id: string;
  url: string;
  timestamp: number;
  options: PhotoOptions;
}
