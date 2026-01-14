import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  seed?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, seed }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync state when props change (vital for pagination)
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src, seed]);

  const handleImageError = () => {
    if (hasError) return; // Prevent infinite loops
    
    setHasError(true);
    // Dynamic high-fidelity placeholder
    const placeholder = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed || alt)}&backgroundColor=064e3b&fontFamily=serif&fontWeight=700&fontSize=40`;
    setImgSrc(placeholder);
  };

  return (
    <div className={`${className} bg-primary-dark/5 flex items-center justify-center overflow-hidden`}>
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default SafeImage;