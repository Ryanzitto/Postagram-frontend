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
      className="w-full h-20 bg-white/80 backdrop-blur-sm flex text-zinc-800"
    >
      <div className="w-full h-full flex justify-center items-center">
        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          NEWS
        </span>
      </div>
    </div>
  );
}
