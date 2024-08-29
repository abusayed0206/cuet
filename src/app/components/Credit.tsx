import Image from 'next/image';
import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-80 h-80 rounded-l-none rounded-r-lg shadow-lg bg-white overflow-hidden">
      <div className="relative w-full h-full">
        <Image
          src="/dp.webp"
          alt="সাঈদ"
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-end pr-4 bg-gradient-to-l from-black/50 to-transparent">
          <div className="writing-vertical-lr text-lg font-semibold text-white">
            <p className="whitespace-nowrap text-yellow-300">সাঈদ</p>
            <p className="whitespace-nowrap text-green-300">❤️ দিয়ে বানানো। Made in Cumilla</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
