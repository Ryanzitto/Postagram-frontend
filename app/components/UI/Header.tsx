"use client";
import {
  Home,
  MessageCircleMore,
  Bell,
  ChevronDown,
  X,
  LogOut,
  Settings,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "app/store";
import LogoutDialog from "./AlertDialog";

export default function Header() {
  const { user } = useStore();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);
  return (
    <>
      {pageIsLoad && (
        <header className="w-full h-[15%] flex relative">
          <div className="w-1/3 h-full flex items-center gap-6 pl-6">
            <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
              <div className="w-4 h-4 rounded-sm bg-zinc-800 rotate-45 custom-animation"></div>
            </div>
            <input
              className="rounded-2xl w-48 h-8 bg-zinc-700/50 outline-none pl-4 text-slate-100/50"
              type="text"
            />
          </div>
          <div className="w-1/3 h-full flex justify-center items-center gap-10">
            <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
              <Home className="w-5 text-white" />
              <div className="bg-white rounded-full w-1 h-1"></div>
            </div>
            <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
              <MessageCircleMore className="w-5 text-white" />
              <div className="bg-white rounded-full w-1 h-1"></div>
            </div>
            <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
              <Bell className="w-5 text-white" />
              <div className="bg-white rounded-full w-1 h-1"></div>
            </div>
          </div>
          <div className="w-1/3 h-full flex justify-end items-start gap-6">
            <AnimatePresence>
              {menuIsOpen && (
                <motion.div
                  initial={{
                    x: 200,
                  }}
                  animate={{
                    x: 0,
                    transition: {
                      delay: 0,
                      duration: 0.1,
                    },
                  }}
                  exit={{
                    x: 200,
                    transition: {
                      delay: 0,
                      duration: 0.1,
                    },
                  }}
                  className={`w-[300px] transition-all fixed h-screen bg-zinc-700/80 border-l border-zinc-600 pt-4 flex flex-col items-center justify-start`}
                >
                  <div className="w-full h-fit flex justify-end pr-6">
                    <X
                      className="text-white hover:text-white/50 cursor-pointer"
                      onClick={() => setMenuIsOpen(!menuIsOpen)}
                    />
                  </div>
                  <div className="w-full h-fit flex items-center justify-center pt-6 gap-2">
                    <div className="w-full h-fit flex flex-col gap-1 items-center justify-center">
                      <div className="w-fit h-fit bg-white rounded-lg">
                        <img className="w-16 h-16" src="/images/cat-1.png" />
                      </div>
                      <span className="text-white font-bold tracking-wide text-sm pt-2">
                        {user.name}
                      </span>
                      <span className="text-white/50 text-xs tracking-wide">
                        @{user.userName}
                      </span>
                      <div className="w-[90%] h-fit flex pt-2 px-2">
                        <div className="flex w-1/3 flex-col gap-1 text-center">
                          <span className="text-white text-xs font-bold">
                            Posts
                          </span>
                          <span className="text-white/50 text-xs">236</span>
                        </div>
                        <div className="flex w-1/3 flex-col gap-1 text-center">
                          <span className="text-white text-xs font-bold">
                            Followers
                          </span>
                          <span className="text-white/50 text-xs">1356</span>
                        </div>
                        <div className="flex w-1/3 flex-col gap-1 text-center">
                          <span className="text-white text-xs font-bold">
                            Following
                          </span>
                          <span className="text-white/50 text-xs">429</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[90%] bg-zinc-600 h-[1px] mt-6"></div>
                  <div className="w-full h-fit flex flex-col items-start pl-14 justify-center pt-6 gap-6">
                    <div className="w-fit gap-3 flex items-start cursor-pointer transition-all text-white/80 hover:text-white/50">
                      <Settings className="w-5 h-5" />
                      <span className="text-sm">Settings</span>
                    </div>
                    <LogoutDialog setMenuIsOpen={setMenuIsOpen}>
                      <div className="w-fit gap-3 flex items-start cursor-pointer transition-all text-white/80 hover:text-white/50">
                        <LogOut className=" w-5 h-5" />
                        <span className="text-sm">Logout</span>
                      </div>
                    </LogoutDialog>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {menuIsOpen === false && (
              <div className="w-fit px-2 p-1 h-fit flex justify-start gap-3 items-center rounded-md bg-zinc-700 mr-6 mt-6">
                <img className="w-8 h-8" src="/images/cat-1.png" />
                <span className="text-white/80 text-sm font-semibold">
                  {user?.name}
                </span>

                <ChevronDown
                  onClick={() => setMenuIsOpen(!menuIsOpen)}
                  className="cursor-pointer text-white w-4 ml-3"
                />
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
}
