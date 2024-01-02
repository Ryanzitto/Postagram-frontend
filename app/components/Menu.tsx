"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useStore } from "../store";
import { useRouter } from "next/navigation";

interface MenuProps {
  menuOpened: boolean;
  setMenuOpened: (value: boolean) => void;
}

export const Menu = (props: MenuProps) => {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const router = useRouter();

  const { user, logout } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  const ref = useRef<HTMLButtonElement | null>(null);

  const { menuOpened, setMenuOpened } = props;

  useEffect(() => {
    setLoad(true);
  }, []);

  useEffect(() => {
    if (load) {
      setMenuOpened(false);
    }
  }, [load]);

  const handleClickLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {load === true && (
        <>
          <button
            ref={ref}
            onClick={() => setMenuOpened(!menuOpened)}
            className="border border-white border-2 z-20 fixed top-12 right-6 lg:right-12 p-3 w-11 h-11 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate"
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
            <div className="flex-1 flex items-start justify-start flex-col gap-6 p-8 bg-zinc-100 pt-28">
              <div className="w-full h-14 flex items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex justify-center items-center">
                  <div className="rounded-full w-[95%] h-[95%] flex justify-center items-center">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={user?.avatar?.src}
                    />
                  </div>
                </div>
                <div className="pl-4 flex gap-4">
                  <span
                    onClick={handleClickLogout}
                    className="cursor-pointer font-bold text-sm text-zinc-800/80 transition-colors hover:opacity-60"
                  >
                    logout
                  </span>
                </div>
              </div>
              <MenuButton label="PROFILE" path={`/perfil/${user?.userName}`} />
              <MenuButton label="FEED" path="/" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

const MenuButton = (props: { label: string; path: string }) => {
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  const { label, path } = props;
  return (
    <button className="text-2xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
      {load && <Link href={path}>{label}</Link>}
    </button>
  );
};
