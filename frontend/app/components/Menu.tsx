"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

interface MenuProps {
  menuOpened: boolean;
  setMenuOpened: (value: boolean) => void;
}

export const Menu = (props: MenuProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const ref2 = useRef<HTMLButtonElement | null>(null);
  const { menuOpened, setMenuOpened } = props;

  return (
    <>
      <button
        ref={ref}
        onClick={() => setMenuOpened(!menuOpened)}
        className="z-20 fixed top-12 right-6 lg:right-12 p-3 w-11 h-11 rounded-md bg-zinc-800"
      >
        <div
          className={`bg-white h-0.5 rounded-md w-full transition-all ${
            menuOpened ? "rotate-45  translate-y-0.5" : ""
          }`}
        />
        <div
          className={`bg-white h-0.5 rounded-md w-full my-1 ${
            menuOpened ? "hidden" : ""
          }`}
        />
        <div
          className={`bg-white h-0.5 rounded-md w-full transition-all ${
            menuOpened ? "-rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`z-10 fixed top-0 right-0 bottom-0 bg-white transition-all overflow-hidden flex flex-col
      ${menuOpened ? "w-80" : "w-0"}`}
      >
        <div className="flex-1 flex items-start justify-center flex-col gap-6 p-8 bg-zinc-100">
          <MenuButton label="HOME" path="/" />
        </div>
      </div>
    </>
  );
};

const MenuButton = (props: { label: string; path: string }) => {
  const { label, path } = props;
  return (
    <button className="text-2xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
      <Link href={path}>{label}</Link>
    </button>
  );
};
