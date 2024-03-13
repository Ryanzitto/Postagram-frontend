"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-zinc-800 flex flex-col justify-center items-center">
      <img className="w-80" src="/images/cat-5.png" />
      <div className="w-fit flex flex-col gap-2">
        <h1 className="text-white/80 font-bold text-3xl sm:text-5xl text-center">
          PAGE NOT FOUND
        </h1>
        <button className="p-2 py-4 rounded-md flex justify-center items-center bg-purple-500 transition-all hover:bg-purple-600">
          <Link className="text-white/80 font-semibold text-sm" href="/">
            CLICK TO GO HOME
          </Link>
        </button>
      </div>
    </div>
  );
}
