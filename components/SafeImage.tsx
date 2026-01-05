
import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  seed?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, seed }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isFallback, setIsFallback] = useState(false);

  // Sync state when props change (vital for dynamic content and pagination)
  useEffect(() => {
    setImgSrc(src);
    setIsFallback(false);
  }, [src, seed]);

  const handleImageError = () => {
    // Prevent infinite loops if the fallback URL itself fails
    if (isFallback) return;
    
    setIsFallback(true);
    
    // Dynamic high-fidelity initials placeholder matching Product Hunt's reliability
    const fallbackSeed = encodeURIComponent(seed || alt || 'User');
    const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${fallbackSeed}&backgroundColor=064e3b&fontFamily=serif&fontWeight=700&fontSize=40`;
    
    setImgSrc(fallbackUrl);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default SafeImage;
