import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 p-4 rounded-t-lg rounded-b-none shadow-lg bg-white flex items-center">
      <div className="flex w-full">
        <div className="w-1/4 flex justify-center items-center">
          <img
            src="/dp.webp"
            alt="সাঈদ"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="w-3/4 flex flex-col justify-center">
          <p className="text-lg font-semibold text-black text-center">সাঈদ</p>
          <p className="text-lg text-black text-center">❤ দিয়া বানানো হইছে!</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
