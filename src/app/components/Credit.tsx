import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-80 p-4 rounded-t-lg rounded-b-none shadow-lg bg-white flex items-center">
      <div className="flex w-full">
        <div className="w-1/4 flex justify-center items-center">
          <img
            src="/sayed.webp"
            alt="সাঈদ"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="w-3/4 flex flex-col justify-center">
          <p className="text-sm font-semibold text-black text-center">
          <a
            href="https://sayed.page/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-black text-center"
          >
            সাঈদ
          </a> | 
            <a
            href="https://cuet.sayed.page/1901049"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-black text-center"
          >
            ১৯০১০৪৯
          </a>

          </p>
          <a
            href="https://cuet.sayed.page/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-black text-center"
          >
            গোপনীয়তা নীতি
          </a>
          <p className="text-sm font-semibold text-black text-center">Made with ❤️ in Cumilla🇧🇩</p>
          
        </div>
      </div>
    </div>
  );
};

export default Card;
