
import React, { useState, useEffect, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { debounce } from '@/utils/performance';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loadingClassName?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loadingClassName = '',
  priority = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (priority) return;
    
    setIsLoading(true);
    setHasError(false);
    
    // Use explicit width and height to prevent CLS
    const img = new Image();
    if (width) img.width = width;
    if (height) img.height = height;
    
    // Add timestamp to prevent caching for development
    const cacheBuster = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';
    img.src = src + cacheBuster;
    
    const handleLoad = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    const handleError = () => {
      console.warn(`Failed to load image: ${src}`);
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
      setHasError(true);
    };
    
    img.onload = handleLoad;
    img.onerror = handleError;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority, width, height]);

  // Calculate aspect ratio to maintain consistent space
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  
  // Set explicit dimensions to prevent layout shift
  const imgStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : undefined,
    aspectRatio: aspectRatio,
    display: 'block', // Removes bottom margin
  };

  if (isLoading) {
    return (
      <Skeleton 
        className={cn(loadingClassName || className)} 
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
          aspectRatio: aspectRatio
        }}
        aria-label={`Chargement de l'image: ${alt}`}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt || "Image"}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn(className, hasError ? "opacity-60" : "")}
      style={imgStyle}
      {...props}
    />
  );
};

export default memo(OptimizedImage);
