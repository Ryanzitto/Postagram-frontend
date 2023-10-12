"use client";
import { useState } from "react";

export default function Header() {
  const [showInput, setShowInput] = useState<boolean>(false);

  const closeSearch = () => {
    const timeOut = setTimeout(() => {
      setShowInput(false);
    }, 3000);

    return () => clearTimeout(timeOut);
  };

  return (
    <div
      onMouseLeave={closeSearch}
      className="w-full h-20 bg-white flex text-zinc-800"
    >
      <div className="w-1/2 h-full flex justify-start items-center relative">
        <div className="bg-zinc-700 rounded-full w-14 h-14 absolute ml-10"></div>
        <ul className="flex gap-4 w-full justify-center items-center">
          <li className="cursor-pointer">
            <a className="font-bold tracking-wider transition-colors hover:opacity-80">
              Home
            </a>
          </li>
          <li className="cursor-pointer">
            <a className="font-bold tracking-wider transition-colors hover:opacity-80">
              Profile
            </a>
          </li>
        </ul>
      </div>
      <div className="w-[10%] h-full flex justify-center items-center">
        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          NEWS
        </span>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        {showInput ? (
          <input className="bg-zinc-100 rounded-sm" type="text"></input>
        ) : null}
        <div
          onMouseEnter={() => setShowInput(true)}
          className={`bg-zinc-600 ${
            showInput ? "rounded-r-sm" : "rounded-sm"
          }  w-8 flex justify-center items-center ${
            showInput ? "hover:opacity-80" : null
          }`}
        >
          <span
            className={`font-bold text-white cursor-pointer transition-colors `}
          >
            S
          </span>
        </div>
      </div>
    </div>
  );
}
