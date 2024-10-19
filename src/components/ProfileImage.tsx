// src/components/ProfileImage.tsx
'use client';

import React from 'react';

interface ProfileImageProps {
  src: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = 'https://cdn.abusayed.dev/demo.png';
  };

  return (
    <div className="w-32 h-32">
      <img
        src={src}
        alt="Profile Picture"
        onError={handleImageError}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

export default ProfileImage;
