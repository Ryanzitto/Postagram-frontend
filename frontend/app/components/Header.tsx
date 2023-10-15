"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full h-10 bg-white/80 backdrop-blur-sm flex flex-col text-zinc-800">
      <div className="w-full h-full flex justify-center items-center"></div>
      <div className="w-full h-[1px] bg-gradient-to-r from-purple-500 to-pink-500"></div>
    </div>
  );
}
