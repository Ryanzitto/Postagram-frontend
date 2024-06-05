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

  const [logoutIsHovered, setLogoutIsHovered] = useState<boolean>(false);

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
      <header className="w-full max-w-[1600px] justify-center items-center h-[15%] flex">
        {/* <div className="w-1/2 md:w-1/3  h-full flex items-center gap-4 md:gap-6 pl-4 md:pl-6 relative"

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
        </div> */}
        <div className="w-1/3 h-full hidden md:flex justify-center items-center gap-6 lg:gap-10">
          <div
            onClick={handleClickFeed}
            onMouseEnter={() => setFeedIsHovered(true)}
            onMouseLeave={() => setFeedIsHovered(false)}
            className="w-fit h-fit flex flex-col text-center justify-center items-center gap-1 cursor-pointer"
          >
            <span className="text-white/50 text-[10px] tracking-[3px] hover:text-white/40 transition-all">
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
            <span className="text-white/50 text-[10px]  tracking-[3px] hover:text-white/40 transition-all">
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
            onMouseEnter={() => setLogoutIsHovered(true)}
            onMouseLeave={() => setLogoutIsHovered(false)}
            className="w-fit h-fit flex flex-col justify-center items-center gap-1 cursor-pointer"
          >
            <LogoutDialog setMenuIsOpen={setMenuIsOpen}>
              <span className="text-white/50 text-[10px]  tracking-[3px] hover:text-red-500 transition-all">
                LOGOUT
              </span>
            </LogoutDialog>
            <div className="w-full h-[1px]">
              <div
                className={`${
                  logoutIsHovered ? "w-full" : "w-0"
                } h-full transition-all bg-red-500`}
              ></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
