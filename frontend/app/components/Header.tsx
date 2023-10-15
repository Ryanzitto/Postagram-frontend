"use client";

import { useState } from "react";

export default function Header() {
  return (
    <div className="w-full h-20 bg-white/80 backdrop-blur-sm flex flex-col text-zinc-800">
      <div className="w-full h-full flex justify-center items-center">
        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          SUB-APP
        </span>
      </div>
      <div className="w-full h-[1px] bg-gradient-to-r from-purple-500 to-pink-500"></div>
    </div>
  );
}
