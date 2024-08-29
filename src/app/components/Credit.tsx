import Image from 'next/image';
import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed bottom-0 top-1/2 transform -translate-y-1/2 w-80 h-80 rounded-l-lg shadow-lg bg-white overflow-hidden flex flex-col items-center">
      <div className="w-full h-40 flex justify-center items-center">
        <Image
          src="https://sayed.page/dp.webp"
          alt="সাঈদ"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="transform text-lg font-semibold text-black">
          <p className="whitespace-nowrap text-center">সাঈদ</p>
          <p className="whitespace-nowrap text-center">❤ দিয়া বানানো হইছে!</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
