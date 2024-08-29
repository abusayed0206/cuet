import Image from 'next/image';
import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-80 h-80 rounded-r-lg shadow-lg bg-white overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src="/dp.webp"
          alt="সাঈদ"
          width={100}
          height={100}
          className="absolute bottom-4 left-4 rounded-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-end pr-4">
          <div className="transform -rotate-90 text-lg font-semibold text-black">
            <p className="whitespace-nowrap">সাঈদ</p>
            <p className="whitespace-nowrap">❤️ দিয়ে বানানো। Made in Cumilla</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
