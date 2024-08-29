import Image from 'next/image';
import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-80 h-40 rounded-l-none rounded-r-lg shadow-lg bg-white overflow-hidden flex">
      <div className="w-1/2 p-4 flex items-center justify-center">
        <Image
          src="/dp.webp"
          alt="সাঈদ"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      </div>
      <div className="w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
        <div className="transform rotate-90 text-lg font-semibold text-white">
          <p className="whitespace-nowrap text-yellow-300">সাঈদ</p>
          <p className="whitespace-nowrap text-green-300">❤️ দিয়ে বানানো।</p>
          <p className="whitespace-nowrap text-blue-300">Made in Cumilla</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
