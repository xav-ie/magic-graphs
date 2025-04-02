interface ImageCacheEntry {
  image: HTMLImageElement | null;
  loading: boolean;
  error: boolean;
}

const imageCache = new Map<string, ImageCacheEntry>();

export const getOrLoadImage = (
  src: string,
  options?: { onLoad?: () => void; onLoadError?: () => void },
): ImageCacheEntry => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  const cacheEntry: ImageCacheEntry = {
    image: null,
    loading: true,
    error: false,
  };
  imageCache.set(src, cacheEntry);

  const img = new Image();
  img.onload = () => {
    cacheEntry.image = img;
    cacheEntry.loading = false;
    options?.onLoad?.();
  };
  img.onerror = () => {
    cacheEntry.loading = false;
    cacheEntry.error = true;
    options?.onLoadError?.();
  };
  img.src = src;

  return cacheEntry;
};
