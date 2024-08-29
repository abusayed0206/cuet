import Image from 'next/image';
import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-80 h-80 rounded-r-lg shadow-lg bg-white overflow-hidden flex flex-col">
      <div className="flex-1 relative">
        <Image
          src="/dp.webp"
          alt="সাঈদ"
          width={100}
          height={100}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="transform rotate+90 text-lg font-semibold text-black">
          <p className="whitespace-nowrap text-center">সাঈদ</p>
          <p className="whitespace-nowrap">❤️ দিয়ে বানানো। Made in Cumilla</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
