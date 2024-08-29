import React from 'react';

const Card: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 rounded-t-lg rounded-b-none shadow-lg bg-white flex items-center">
      <div className="flex">
        <div className="flex justify-center items-center pr-4">
          <img
            src="/dp.webp"
            alt="সাঈদ"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <a
            href="https://sayed.page/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-black text-center"
          >
            সাঈদ
          </a>
          <p className="text-xs text-black text-center">
            ❤️ দিয়ে বানানো হইছে। <br />
            Made in Cumilla🇧🇩
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
