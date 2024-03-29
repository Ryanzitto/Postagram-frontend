"use client";

import axios from "axios";
import { X, LogOut, Settings, AlignJustify, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, ChangeEvent } from "react";
import { useStore } from "app/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LogoutDialog from "./AlertDialog";
import CardProfile from "./CardProfile";

interface User {
  bio: string;
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
  totalPosts: number;
}

interface Like {
  create: string;
  userId: string;
}

interface Posts {
  subject: string;
  text: string;
  bgColor: string;
  textColor: string;
  textAlign?: string;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  user: {
    name: string;
    userName: string;
    createdAt: string;
    avatar: string;
  };
  _id: string;
}

const Skeleton = () => {
  return (
    <div className="w-10 h-10 md:w-28 md:h-10 p-2 fixed flex rounded-md skeleton-loading mr-6"></div>
  );
};

export default function Header() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user, logout } = useStore();

  const router = useRouter();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const [feedIsHovered, setFeedIsHovered] = useState<boolean>(false);

  const [profileIsHoovered, setProfileIsHovered] = useState<boolean>(false);

  const [messagesIsHovered, setMessagesIsHovered] = useState<boolean>(false);

  const [contentSearch, setContentSearch] = useState<string>("");

  const [posts, setPosts] = useState<Posts[]>();

  const [users, setUsers] = useState<User[]>();

  const handleClickProfile = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleClickFeed = () => {
    router.push(`/`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContentSearch(e.target.value);
  };

  const filteredUsers =
    contentSearch !== ""
      ? users?.filter((users) =>
          users.name
            .toLocaleLowerCase()
            .includes(contentSearch.toLocaleLowerCase())
        )
      : users;

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
        // console.log(response);
        setTotalPostsUser(response?.data?.length);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/post/`)
      .then((response) => {
        // console.log(response);
        setPosts(response?.data?.results);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/user/`)
      .then((response) => {
        // console.log(response?.data);
        setUsers(response?.data);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  }, []);

  return (
    <>
      <header className="w-full max-w-[1600px] h-[15%] flex">
        <div className="w-1/2 md:w-1/3  h-full flex items-center gap-4 md:gap-6 pl-4 md:pl-6 relative">
          {contentSearch !== "" && (
            <div className="fixed flex h-screen w-[250px] md:w-[350px] z-40 bg-zinc-700/80 backdrop-blur-md left-0 top-0 justify-center items-center p-2">
              <div className="flex flex-col w-full h-full justify-start items-center">
                <div className="flex w-full justify-end">
                  <div
                    onClick={() => setContentSearch("")}
                    className="bg-purple-500  rounded-md hover:bg-red-500 flex justify-center items-center p-1 cursor-pointer"
                  >
                    <X className="text-white w-3 h-3 md:w-5 md:h-5" />
                  </div>
                </div>
                <div
                  className={`w-full h-fit mt-16 gap-4 flex flex-wrap justify-center items-start overflow-auto`}
                >
                  {filteredUsers?.map((user) => {
                    return (
                      <div
                        key={user._id}
                        className="flex h-fit flex-col gap-2 justify-center items-center pt-0 md:pt-4 w-[40px] md:w-[80px]"
                      >
                        <CardProfile
                          user={user}
                          handleClickProfile={handleClickProfile}
                        />
                        <span
                          onClick={() => handleClickProfile(user.userName)}
                          className="text-white/50 text-[8px] md:text-xs cursor-pointer transition-all hover:text-white/30 w-fit text-center"
                        >
                          {user.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {filteredUsers?.length === 0 && (
                  <span className="text-white/30 text-sm font-semibold">
                    No users matching the search.
                  </span>
                )}
              </div>
            </div>
          )}
          <div
            className={`  ${
              contentSearch !== "" ? "hidden" : null
            } flex z-40 w-6 h-6 md:w-8 md:h-8 rounded-full justify-center items-center bg-white`}
          >
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-zinc-800 rotate-45 custom-animation"></div>
          </div>
          <div
            className={`${
              contentSearch !== "" ? "z-40 fixed" : "flex"
            } rounded-md flex justify-center items-center px-1 text-xs md:text-sm w-32 md:w-48 h-8 border border-zinc-600 ${
              contentSearch !== "" ? "bg-zinc-800" : "bg-zinc-700/50"
            }`}
          >
            <Search className={`text-white/50 w-4 h-4`} />
            <input
              className="w-[85%] outline-none pl-2 bg-transparent text-white/50 placeholder:text-white/50"
              type="text"
              placeholder="Search a user"
              value={contentSearch}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="w-1/3 h-full hidden md:flex justify-center items-center gap-6 lg:gap-10">
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
          {/* <div
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
          </div> */}
        </div>
        <div
          className={`w-1/2 md:w-1/3 h-full flex justify-end items-center gap-6`}
        >
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
                className={`w-[300px] bottom-0 z-60 transition-all fixed h-screen bg-zinc-700/80 backdrop-blur-md border-l border-zinc-600 pt-4 flex flex-col items-center justify-start`}
              >
                <div className="w-full h-fit flex justify-end pr-6">
                  <X
                    className="text-white hover:text-white/50 cursor-pointer"
                    onClick={() => setMenuIsOpen(!menuIsOpen)}
                  />
                </div>
                <div className="w-full h-fit flex items-center justify-center pt-6 gap-2">
                  <div className="w-full h-fit flex flex-col gap-1 items-center justify-center">
                    <div className="w-fit h-fit bg-zinc-800/60 rounded-lg p-1">
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
                  <LogoutDialog setMenuIsOpen={setMenuIsOpen}>
                    <div className="w-fit gap-3 flex items-start cursor-pointer transition-all text-white/80 hover:text-white/50">
                      <LogOut className=" text-white/50 w-4 h-4" />
                      <span className="text-white/50 text-xs tracking-[3px] hover:text-red-500/80 transition-all">
                        LOGOUT
                      </span>
                    </div>
                  </LogoutDialog>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {pageIsLoad ? (
            <>
              {menuIsOpen === false && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    delay: 0,
                    duration: 1,
                  }}
                  className="w-fit p-2 fixed  h-fit flex justify-start items-center rounded-md border border-zinc-600 bg-zinc-700/50 mr-6"
                >
                  <span className="hidden md:flex text-white/80 text-xs font-semibold">
                    {user?.name}
                  </span>
                  <AlignJustify
                    onClick={() => setMenuIsOpen(!menuIsOpen)}
                    className="cursor-pointer text-white w-4 ml-0 md:ml-3 transition-all hover:text-white/50"
                  />
                </motion.div>
              )}
            </>
          ) : (
            <Skeleton />
          )}
        </div>
      </header>
    </>
  );
}
