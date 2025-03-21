
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
    // If priority is true, image is already loaded
    if (priority) return;
    
    // Reset loading state when src changes
    setIsLoading(true);
    setHasError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      // On error, use a placeholder and set loading to false
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
      setHasError(true);
    };
    
    // Clean up
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  // Set explicit dimensions to prevent layout shift
  const imgStyle = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    aspectRatio: width && height ? `${width} / ${height}` : undefined,
  };

  if (isLoading) {
    return (
      <Skeleton 
        className={cn(loadingClassName || className)} 
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
          aspectRatio: width && height ? `${width} / ${height}` : undefined
        }}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
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

export default OptimizedImage;
