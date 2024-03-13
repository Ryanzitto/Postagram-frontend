"use client";

import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Settings2 } from "lucide-react";
import { useStore } from "app/store";
import { toast } from "sonner";
import Header from "../UI/Header";
import Post from "../UI/Post";
import Preview from "../../components/UI/Preview";
import ProfileCard from "../UI/ProfileCard";
import EditDialog from "../UI/EditProfileDialog";

interface textColors {
  textColor: string;
  bgColor: string;
}

interface Props {
  userNameProp: string;
}

interface Comment {
  comment: string;
  createdAt: string;
  idComment: string;
  userId: string;
  userName: string;
}

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

interface Post {
  subject: string;
  text: string;
  bgColor: string;
  textColor: string;
  likes: [];
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

export default function ProfilePage({ userNameProp }: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user, logout } = useStore();

  const router = useRouter();

  const [userProfile, setUserProfile] = useState<User>();

  const [posts, setPosts] = useState<Post[]>();

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [content, setContent] = useState<string | null>(null);

  const [shouldShowCreatePost, sethouldShowCreatePost] =
    useState<boolean>(false);

  const [shouldShowEditProfile, setshouldShowEditProfile] =
    useState<boolean>(false);

  const [bgColorSelected, setBgColorSelected] = useState<string>("bg-white");

  const [textColorSelected, setTextColorSelected] = useState<textColors>({
    textColor: "text-black",
    bgColor: "bg-black",
  });

  const closeButtonModalRef = useRef<HTMLSpanElement | null>(null);

  const updateUser = () => {
    axios
      .get(`${URL}/user/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
        setTotalPostsUser(response.data.totalPosts);
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
  };

  const handleChangeInputContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e?.target?.value);
  };

  const fetchPosts = () => {
    axios
      .get(`${URL}/post/byUserName/${userProfile?.userName}`)
      .then((response) => {
        console.log(response);
        setPosts(response.data);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    axios
      .get(`${URL}/user/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
        setTotalPostsUser(response.data.totalPosts);
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
      .get(`${URL}/post/byUserName/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setPosts(response.data);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (content === "") {
      setContent(null);
    }
  }, [content]);

  return (
    <Dialog.Root>
      <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-center overflow-x-hidden">
        <Header />
        <div className="w-full max-w-[1600px] h-[85%] flex flex-col lg:flex-row justify-start items-center">
          <div className="w-full lg:w-[30%] h-fit md:h-full flex flex-col items-center justify-start pt-0 md:pt-6">
            <ProfileCard
              userProfile={userProfile}
              totalPostsUser={totalPostsUser}
            />
          </div>
          <div className="w-[90%] lg:w-[70%] h-fit md:h-full max-h-full flex justify-start md:justify-center lg:justify-start items-start pt-6">
            <div className="rounded-lg w-[700px] h-fit flex flex-col items-start justify-start">
              {userProfile && (
                <div className="flex flex-col w-full">
                  {userProfile?._id === user._id && (
                    <div className="w-full h-fit flex gap-4">
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          delay: 0,
                          duration: 1,
                        }}
                        className={`${
                          shouldShowCreatePost
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-purple-500 hover:bg-purple-600"
                        } transition-all  px-2 rounded-md py-2 flex gap-1 justify-center items-center`}
                        onClick={() =>
                          sethouldShowCreatePost(!shouldShowCreatePost)
                        }
                      >
                        {shouldShowCreatePost ? (
                          <Minus className="w-5 h-5 text-white/80" />
                        ) : (
                          <Plus className="w-5 h-5 text-white/80" />
                        )}
                        <span
                          className={`${
                            shouldShowCreatePost ? "hidden" : "flex"
                          } text-sm text-white/80 font-semibold tracking-wider`}
                        >
                          Create
                        </span>
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          delay: 0,
                          duration: 1,
                        }}
                        className={` ${
                          shouldShowEditProfile
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-purple-500 hover:bg-purple-600"
                        } bg-purple-500 hover:bg-purple-600 transition-all  px-2 rounded-md py-2 flex gap-2 justify-center items-center`}
                        onClick={() =>
                          setshouldShowEditProfile(!shouldShowEditProfile)
                        }
                      >
                        <Settings2 className="w-4 h-4 text-white/80" />
                        <span
                          className={`${
                            shouldShowEditProfile ? "hidden" : "flex"
                          } text-sm text-white/80 font-semibold tracking-wider`}
                        >
                          Edit Profile
                        </span>
                      </motion.button>
                    </div>
                  )}
                  <AnimatePresence>
                    {shouldShowCreatePost && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            delay: 0,
                            duration: 1,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          transition: {
                            delay: 0,
                            duration: 0.1,
                          },
                        }}
                        className="w-full h-fit bg-zinc-700/50 border border-zinc-500/80 rounded-xl flex p-4 mt-4"
                      >
                        <div className="w-fit h-fit flex">
                          <div className="w-16 h-16 grid bg-purple-500 rounded-md">
                            <img
                              className="w-full h-full"
                              src={`/images/${userProfile?.avatar}`}
                            />
                          </div>
                        </div>
                        <div
                          onChange={handleChangeInputContent}
                          className="w-full h-fit flex flex-col px-4 gap-3"
                        >
                          <Dialog.Trigger>
                            <textarea
                              value={content !== null ? content : ""}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="What are your words today?"
                              className={`text-sm rounded-xl w-full pt-5 ${
                                content !== null ? "pb-5" : null
                              } pl-4 sm:pl-10  h-fit bg-zinc-800/60 outline-none text-white/50 placeholder:text-white/30 `}
                            />
                          </Dialog.Trigger>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {shouldShowEditProfile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            delay: 0,
                            duration: 1,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          transition: {
                            delay: 0,
                            duration: 0.1,
                          },
                        }}
                      >
                        <EditDialog
                          actualUser={userProfile}
                          updateUser={updateUser}
                          setshouldShowEditProfile={setshouldShowEditProfile}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Dialog.Portal>
                    <Dialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
                      <Dialog.Content className="relative w-[500px] min-h-fit h-fit bg-zinc-800 border border-zinc-600 rounded-lg">
                        <Dialog.Close className="absolute right-0 top-0 bg-zinc-700/50 transition-all p-2 px-4 rounded-tr-lg text-white/50 hover:text-white/80 hover:bg-purple-500">
                          <span ref={closeButtonModalRef}>X</span>
                        </Dialog.Close>
                        <Preview
                          fetchPosts={fetchPosts}
                          closeButtonModalRef={closeButtonModalRef}
                          textColorSelected={textColorSelected}
                          bgColorSelected={bgColorSelected}
                          content={content}
                          setContent={setContent}
                          setTextColorSelected={setTextColorSelected}
                          setBgColorSelected={setBgColorSelected}
                        />
                      </Dialog.Content>
                    </Dialog.Overlay>
                  </Dialog.Portal>
                </div>
              )}
              {!userProfile && (
                <div className="flex flex-col w-full h-fit">
                  <div className="flex flex-col w-full">
                    <div className="w-full h-fit flex gap-4">
                      <button
                        className={`skeleton-loading w-24 h-10 transition-all  px-2 rounded-md py-2 flex gap-1 justify-center items-center`}
                      ></button>
                      <button
                        className={`skeleton-loading w-24 h-10 transition-all  px-2 rounded-md py-2 flex gap-2 justify-center items-center`}
                      ></button>
                    </div>
                  </div>
                  <div className="w-20 h-6 skeleton-loading  rounded-md mt-8"></div>
                  <div className="mt-4 w-full h-[480px] skeleton-loading  rounded-xl"></div>
                </div>
              )}
              <div className="flex flex-col w-full ">
                <div className="w-full flex pl-4">
                  {totalPostsUser > 0 && (
                    <span
                      className={`${
                        userProfile?._id === user._id ? "pt-10" : "pt-0"
                      } text-white/10 text-xs `}
                    >
                      Recents Posts
                    </span>
                  )}
                </div>
                <div className="w-full h-fit flex flex-col gap-4 justify-start items-start pt-3 py-6">
                  {posts?.map((post) => {
                    return <Post key={post._id} post={post} />;
                  })}
                  {errorMessage ? (
                    <div className="w-full h-60 flex justify-center items-center">
                      <p className="text-white/50 font-bold tracking-wider text-lg">
                        {errorMessage}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Dialog.Root>
  );
}
