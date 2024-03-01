"use client";

import { X, LogOut, Settings, AlignJustify, Search } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, ChangeEvent } from "react";
import { useStore } from "app/store";
import LogoutDialog from "./AlertDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ptBR } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

interface User {
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
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

  const [filterSelected, setFilterSelected] = useState<string>("POSTS");

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
        if (error.response.data.message === "Token has expired") {
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
        console.log(response);
        setPosts(response.data.results);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
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
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  }, []);

  const handleClickProfile = (username: string) => {
    console.log(username);
    router.push(`/profile/${username}`);
  };

  const handleClickFeed = () => {
    router.push(`/`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContentSearch(e.target.value);
  };

  const filteredPosts =
    contentSearch !== ""
      ? posts?.filter((post) =>
          post.text
            .toLocaleLowerCase()
            .includes(contentSearch.toLocaleLowerCase())
        )
      : posts;

  const filteredUsers =
    contentSearch !== ""
      ? users?.filter((users) =>
          users.name
            .toLocaleLowerCase()
            .includes(contentSearch.toLocaleLowerCase())
        )
      : users;

  const handleClickUserName = (username: string) => {
    router.push(`/profile/${username}`);
  };
  return (
    <>
      <header className="w-full h-[15%] flex relative">
        <div className="w-1/3 h-full flex items-center gap-6 pl-6 relative">
          {contentSearch !== "" && (
            <div className="absolute flex h-fit rounded-lg w-full z-40 bg-zinc-800/80 backdrop-blur-sm left-0 top-[100px] justify-center items-center p-4">
              <div className="flex flex-col w-full gap-4 h-full justify-start items-center">
                <div className="flex gap-2 justify-center items-center">
                  <div
                    onClick={() => setFilterSelected("POSTS")}
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-white/50 font-semibold text-xs tracking-wider">
                      POSTS
                    </span>
                    <div
                      className={`h-[2px] w-full ${
                        filterSelected === "POSTS"
                          ? "bg-purple-500"
                          : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                  <div
                    onClick={() => setFilterSelected("USERS")}
                    className="flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="text-white/50 font-semibold text-xs tracking-wider">
                      USERS
                    </span>

                    <div
                      className={`h-[2px] w-full ${
                        filterSelected === "USERS"
                          ? "bg-purple-500"
                          : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col w-full gap-4 h-full justify-start items-center">
                  {filterSelected === "POSTS" &&
                    filteredPosts?.map((post) => {
                      return (
                        <div
                          key={post._id}
                          className="flex flex-col gap-2 w-full bg-zinc-700 p-4 rounded-lg border border-zinc-500/80"
                        >
                          <div className="w-full h-fit py-2 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/50"></div>
                            <span className="text-xs text-white/50">
                              {formatDistanceToNow(post.createdAt, {
                                locale: ptBR,
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <div className="flex flex-col  items-start justify-center">
                            <span className="text-white/80 font-semibold text-sm">
                              Author:
                            </span>
                            <div className="w-full flex gap-2 py-2 items-center">
                              {post.user.avatar && (
                                <img
                                  className="bg-white w-8 h-8 rounded-lg"
                                  src={`/images/${post?.user?.avatar}`}
                                />
                              )}
                              <div className="flex flex-col">
                                <span className="text-white/80 text-sm">
                                  {post.user.name}
                                </span>
                                <span
                                  onClick={() =>
                                    handleClickUserName(post.user.userName)
                                  }
                                  className="text-white/50 text-xs cursor-pointer transition-all hover:text-white/30"
                                >
                                  @{post.user.userName}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col  items-start justify-center py-2 break-all">
                            <span className="text-white/80 font-semibold text-sm">
                              Content:{" "}
                            </span>
                            <span className="text-white/50 text-sm">
                              {post.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  {filterSelected === "USERS" &&
                    filteredUsers?.map((user) => {
                      return (
                        <div
                          key={user._id}
                          className="flex flex-col gap-2 w-full bg-zinc-700 p-4 rounded-lg border border-zinc-500/80"
                        >
                          <div className="flex flex-col  items-start justify-center">
                            <span className="text-white/80 font-semibold">
                              Name:
                            </span>
                            <span className="text-white/50 text-sm">
                              {user.name}
                            </span>
                          </div>
                          <div className="flex flex-col  items-start justify-center">
                            <span className="text-white/80 font-semibold">
                              userName:
                            </span>
                            <span className="text-white/50 text-sm">
                              {user.userName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {filterSelected === "POSTS" && filteredPosts?.length === 0 && (
                  <span className="text-white/30 text-sm font-semibold">
                    No posts matching the search.
                  </span>
                )}
                {filterSelected === "USERS" && filteredUsers?.length === 0 && (
                  <span className="text-white/30 text-sm font-semibold">
                    No users matching the search.
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
            <div className="w-4 h-4 rounded-sm bg-zinc-800 rotate-45 custom-animation"></div>
          </div>
          <div className="rounded-md flex justify-center items-center px-1 text-sm w-48 h-8 border border-zinc-600 bg-zinc-700/50">
            <Search className="text-white/50 w-4 h-4" />
            <input
              className="w-[85%] outline-none pl-2 bg-transparent text-white/50"
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
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
