"use client";
import { useRef, useEffect, useState } from "react";
import { useStore } from "../store";
import { useRouter } from "next/navigation";

interface MenuProps {
  menuOpened: boolean;
  setMenuOpened: (value: boolean) => void;
}

export const Menu = (props: MenuProps) => {
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

  const navigateToProfile = () => {
    router.push(`/perfil/${user?.userName}`);
    setMenuOpened(false);
  };

  const navigateToFeed = () => {
    router.push("/");
    setMenuOpened(false);
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
            <div className="flex-1 flex items-start justify-start flex-col gap-6 p-8 bg-zinc-100 pt-11">
              <div className="w-full h-14 flex items-center mb-10">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex justify-center items-center">
                  <div className="rounded-full w-[95%] h-[95%] flex justify-center items-center">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={user?.avatar?.src}
                    />
                  </div>
                </div>
                <div className="pl-4 flex flex-col gap-1">
                  <span className="font-bold text-sm text-zinc-800/80 transition-colors hover:opacity-60">
                    {user?.name}
                  </span>
                  <span className="font-medium text-xs text-zinc-800/80 transition-colors hover:opacity-60">
                    @{user?.userName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-10 items-start">
                <MenuButton func={navigateToProfile} label="PROFILE" />
                <MenuButton func={navigateToFeed} label="FEED" />
                <span className="text-xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
                  RANK
                </span>
                <span className="text-xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
                  INFO
                </span>
                <span className="text-xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
                  HALL
                </span>
                <div className="w-full flex items-center gap-2">
                  <span
                    onClick={handleClickLogout}
                    className="text-xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors"
                  >
                    LOGOUT
                  </span>
                  <img
                    className="w-4 h-4"
                    src="https://cdn-icons-png.flaticon.com/128/126/126467.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const MenuButton = (props: { label: string; func: () => void }) => {
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
  }, []);

  const { label, func } = props;
  return (
    <button className="text-xl font-bold text-zinc-800 cursor-pointer hover:opacity-80 transition-colors">
      {load && <span onClick={func}>{label}</span>}
    </button>
  );
};
