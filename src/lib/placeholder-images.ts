import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// This is being deprecated in favor of directly importing the json
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
