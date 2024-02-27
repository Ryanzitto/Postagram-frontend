"use client";

import {
  Home,
  MessageCircleMore,
  Bell,
  X,
  LogOut,
  Settings,
  AlignJustify,
  Search,
} from "lucide-react";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "app/store";
import LogoutDialog from "./AlertDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user } = useStore();

  const router = useRouter();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const [feedIsHovered, setFeedIsHovered] = useState<boolean>(false);
  const [profileIsHoovered, setProfileIsHovered] = useState<boolean>(false);
  const [messagesIsHovered, setMessagesIsHovered] = useState<boolean>(false);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  useEffect(() => {
    if (user.token === "") {
      toast.error("you need to be logged to continue.");
      router.push("/auth/signIn");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/post/byUserName/${user.userName}`)
      .then((response) => {
        console.log(response);
        setTotalPostsUser(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickProfile = (username: string) => {
    router.push(`/perfil/${username}`);
  };

  const handleClickFeed = () => {
    router.push(`/`);
  };

  return (
    <>
      <header className="w-full h-[15%] flex relative">
        <div className="w-1/3 h-full flex items-center gap-6 pl-6">
          <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
            <div className="w-4 h-4 rounded-sm bg-zinc-800 rotate-45 custom-animation"></div>
          </div>
          <div className="rounded-md flex justify-center items-center px-1 text-sm w-48 h-8 border border-zinc-600 bg-zinc-700/50">
            <Search className="text-white/50 w-4 h-4" />
            <input
              className="w-[85%] outline-none pl-2 bg-transparent text-white/50"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="w-1/3 h-full flex justify-center items-center gap-10">
          <div
            onClick={handleClickFeed}
            onMouseEnter={() => setFeedIsHovered(true)}
            onMouseLeave={() => setFeedIsHovered(false)}
            className="w-fit h-fit flex flex-col justify-center items-center gap-1 cursor-pointer"
          >
            <span className="text-white/50 text-xs tracking-[3px] hover:text-white/40 transition-all">
              FEED
            </span>
            <div className="w-full h-[1px]">
              <div
                className={`${
                  feedIsHovered ? "w-full" : "w-0"
                } h-full transition-all bg-purple-500`}
              ></div>
            </div>
          </div>
          <div
            onMouseEnter={() => setProfileIsHovered(true)}
            onMouseLeave={() => setProfileIsHovered(false)}
            onClick={() => handleClickProfile(user.userName)}
            className="w-fit h-fit flex flex-col justify-center items-center gap-1 cursor-pointer"
          >
            <span className="text-white/50 text-xs tracking-[3px] hover:text-white/40 transition-all">
              PROFILE
            </span>
            <div className="w-full h-[1px]">
              <div
                className={`${
                  profileIsHoovered ? "w-full" : "w-0"
                } h-full transition-all bg-purple-500`}
              ></div>
            </div>
          </div>
          <div
            onMouseEnter={() => setMessagesIsHovered(true)}
            onMouseLeave={() => setMessagesIsHovered(false)}
            className="w-fit h-fit flex flex-col justify-center items-center gap-1 cursor-pointer"
          >
            <span className="text-white/50 text-xs tracking-[3px] hover:text-white/40 transition-all">
              MESSAGES
            </span>
            <div className="w-full h-[1px]">
              <div
                className={`${
                  messagesIsHovered ? "w-full" : "w-0"
                } h-full transition-all bg-purple-500`}
              ></div>
            </div>
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
                      {pageIsLoad && (
                        <img
                          className="w-16 h-16"
                          src={`/images/${user.avatar}`}
                        />
                      )}
                    </div>
                    <span className="text-white font-bold tracking-w3de text-sm pt-2">
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
                        <span className="text-white/50 text-xs">
                          {totalPostsUser}
                        </span>
                      </div>
                      <div className="flex w-1/3 flex-col gap-1 text-center">
                        <span className="text-white text-xs font-bold">
                          Followers
                        </span>
                        <span className="text-white/50 text-xs">
                          {user.followers.length}
                        </span>
                      </div>
                      <div className="flex w-1/3 flex-col gap-1 text-center">
                        <span className="text-white text-xs font-bold">
                          Following
                        </span>
                        <span className="text-white/50 text-xs">
                          {user.following.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[90%] bg-zinc-600 h-[1px] mt-6"></div>
                <div className="w-full h-fit flex flex-col items-start pl-14 justify-center pt-6 gap-6">
                  <div className="w-fit gap-3 flex items-start cursor-pointer transition-all text-white/80 hover:text-white/50">
                    <Settings className="w-4 h-4" />
                    <span className="text-xs">Settings</span>
                  </div>
                  <LogoutDialog setMenuIsOpen={setMenuIsOpen}>
                    <div className="w-fit gap-3 flex items-start cursor-pointer transition-all text-white/80 hover:text-white/50">
                      <LogOut className=" w-4 h-4" />
                      <span className="text-xs">Logout</span>
                    </div>
                  </LogoutDialog>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {menuIsOpen === false && (
            <div className="w-fit px-2 p-1 fixed  h-fit flex justify-start gap-3 items-center rounded-md border border-zinc-600 bg-zinc-700/50 mr-6 mt-6">
              {pageIsLoad && (
                <img className="w-8 h-8" src={`/images/${user.avatar}`} />
              )}
              {pageIsLoad ? (
                <span className="text-white/80 text-sm font-semibold">
                  {user?.name}
                </span>
              ) : (
                <span className="text-white/80 text-sm font-semibold">...</span>
              )}

              <AlignJustify
                onClick={() => setMenuIsOpen(!menuIsOpen)}
                className="cursor-pointer text-white w-4 ml-3"
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
}
