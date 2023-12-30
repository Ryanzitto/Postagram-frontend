"use client";

import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import { Modal } from "../General/Modal";

import { useEffect, useState } from "react";
import { useStore } from "app/store";
import axios from "axios";
import Link from "next/link";

import UpdatePostProfile from "app/components/Forms/updatePostProfile";
import Spinner from "app/components/Spinner";
import CreateCommentProfile from "../Forms/createCommentProfile";

interface User {
  avatar: {
    src: string;
    _id: string;
  };
  email: string;
  name: string;
  userName: string;
  _id: string;
  bio: string;
}

interface DateFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
}

interface Post {
  banner: {
    src: string;
    _id: string;
  };
  comments: Array<any>;
  _id: string;
  likes: Array<any>;
  text: string;
  title: string;
  createdAt: string;
  __v: number;
  user: {
    avatar: {
      src: string;
      _id: string;
    };
    bio?: string;
    email: string;
    name: string;
    userName: string;
    _id: string;
    __v: number;
  };
}

interface Props {
  post: {
    banner: {
      src: string;
      _id: string;
    };
    comments: Array<any>;
    _id: string;
    likes: Array<any>;
    text: string;
    title: string;
    createdAt: string;
    __v: number;
    user: {
      avatar: {
        src: string;
        _id: string;
      };
      bio?: string;
      email: string;
      name: string;
      userName: string;
      _id: string;
      __v: number;
    };
  };
  userName: string;
}

const Post = ({ post, userName }: Props) => {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const {
    user,
    loading,
    fetchDataProfile,
    setUpdateIsOpen,
    setCurrentPostUpdatingId,
  } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const [dataPost, setDataPost] = useState<Post>(post);

  const [userHasLiked, setUserHasLiked] = useState<boolean>(
    post.likes.some((obj) => obj.userId === user._id)
  );

  const [likeButtonIsHovered, setLikeButtonIsHovered] =
    useState<boolean>(false);

  const [updateButtonIsHovered, setUpdateButtonIsHovered] =
    useState<boolean>(false);

  const [deleteButtonIsHovered, setDeleteButtonIsHovered] =
    useState<boolean>(false);

  const like = () => {
    axios
      .patch(
        `${URL}/post/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        fetchDataPost(post._id);
      })
      .catch((error) => {});
  };

  const deletePost = (_id: string | undefined, _idPicture: string) => {
    const data = {
      idPicture: _idPicture,
    };
    axios
      .delete(`${URL}/post/${_id}`, {
        data,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setShowModal(false);
        const timeout = setTimeout(() => {
          fetchDataProfile(userName);
        }, 1200);
        return () => clearTimeout(timeout);
      })
      .catch((error) => {});
  };

  const dateFormated = (date: string) => {
    const dataOriginal = date;

    const dataPost = new Date(dataOriginal);

    const options: DateFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const result = dataPost.toLocaleDateString("pt-BR", options);
    return result;
  };

  const fetchDataPost = (_id: string) => {
    axios
      .get(`${URL}/post/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setDataPost(response.data.posts);
        setUserHasLiked(!userHasLiked);
      })
      .catch((error) => {});
  };

  const handleClickUpdate = () => {
    setUpdateIsOpen(true);
    setCurrentPostUpdatingId(post._id);
  };

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <motion.div
      whileInView={"visible"}
      initial={{
        opacity: 0,
      }}
      variants={{
        visible: {
          opacity: 1,
          transition: {
            duration: 1,
            delay: 0,
          },
        },
      }}
      className="w-[95%] flex flex-col h-fit bg-white justify-start items-center relative rounded-md hover:bg-zinc-200/30 py-6 text-zinc-800 border border-slate-300"
    >
      {load === true && loading === false ? (
        <>
          <div className="w-[90%] h-20 flex justify-start items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
              <div className="rounded-full w-[95%] h-[95%] flex justify-center items-center">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={`${URL}/${dataPost.user.avatar.src}`}
                />
              </div>
            </div>

            <div className="flex flex-col items-start h-full pt-2 pl-2">
              <span className="text-lg font-bold hover:opacity-80">
                <Link href={`/perfil/${dataPost?.user?.userName}`}>
                  {dataPost?.user?.userName}
                </Link>
              </span>
              <span className="text-xs">{dateFormated(post?.createdAt)}</span>
            </div>
          </div>
          <div className="w-[90%] h-fit flex flex-col p-2">
            <h2 className="text-2xl font-black">{dataPost.title}</h2>
            <h2 className="text-sm font-light">{dataPost.text}</h2>
          </div>
          <div className="w-full h-fit flex justify-center items-center">
            <div className="w-[90%] h-fit pt-2 flex justify-center items-center">
              <img
                className="rounded-md w-full h-full max-w-[580px] max-h-[600px] object-cover"
                src={URL + "/" + dataPost.banner.src}
              />
            </div>
          </div>

          <div className="w-[90%] flex justify-end items-center gap-4 h-16 pr-2 py-1">
            <div className="rounded-full p-2 transition-colors cursor-pointer relative flex justify-center items-center">
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 50,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: 0,
                    }}
                    className="gap-4 z-40 absolute w-[250px] h-fit py-4 px-2 rounded-md border border-slate-300 flex flex-col bg-white text-center"
                  >
                    <span className="text-xs font-bold">
                      Are you sure to delete this post?
                    </span>
                    <div className="flex w-full justify-center items-center gap-4">
                      <button
                        onClick={() =>
                          deletePost(dataPost._id, dataPost.banner._id)
                        }
                        className="font-bold bg-zinc-100 rounded-md px-4 py-1 text-sm hover:text-white hover:bg-green-500"
                      >
                        yes
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="font-bold bg-zinc-100 rounded-md px-4 py-1 text-sm hover:text-white hover:bg-red-500"
                      >
                        no
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-[90%] flex justify-end items-center gap-6 h-16 pr-2 py-1">
                {user?._id === dataPost?.user?._id && (
                  <>
                    <div className="relative flex justify-center items-center">
                      <img
                        onMouseEnter={() => setDeleteButtonIsHovered(true)}
                        onMouseLeave={() => setDeleteButtonIsHovered(false)}
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer w-8 transition-colors transition-colors hover:opacity-80"
                        src="https://cdn-icons-png.flaticon.com/128/6590/6590956.png"
                      />
                      <AnimatePresence>
                        {deleteButtonIsHovered && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                            }}
                            transition={{
                              duration: 0.2,
                              delay: 0,
                            }}
                            className="px-2 py-1 absolute flex justify-center items-center mb-16 rounded-sm bg-white border border-slate-300 shadow-md"
                          >
                            <span className="text-zinc-600 font-semibold">
                              DELETE
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative flex justify-center items-center">
                      <img
                        onMouseEnter={() => setUpdateButtonIsHovered(true)}
                        onMouseLeave={() => setUpdateButtonIsHovered(false)}
                        onClick={handleClickUpdate}
                        className="cursor-pointer w-6 flex transition-colors transition-colors hover:opacity-80"
                        src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                      />
                      <AnimatePresence>
                        {updateButtonIsHovered && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.8,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                            }}
                            transition={{
                              duration: 0.2,
                              delay: 0,
                            }}
                            className="px-2 py-1 absolute flex justify-center items-center mb-16 rounded-sm bg-white border border-slate-300 shadow-md"
                          >
                            <span className="text-zinc-600 font-semibold">
                              UPDATE
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
                <div className="relative flex justify-center items-center gap-1">
                  <span className="text-lg">{dataPost.likes.length}</span>
                  <img
                    onMouseEnter={() => setLikeButtonIsHovered(true)}
                    onMouseLeave={() => setLikeButtonIsHovered(false)}
                    onClick={like}
                    className="cursor-pointer w-7 flex"
                    src={
                      userHasLiked
                        ? "https://cdn-icons-png.flaticon.com/128/2589/2589175.png"
                        : "https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
                    }
                  />
                  <AnimatePresence>
                    {likeButtonIsHovered && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        transition={{
                          duration: 0.2,
                          delay: 0,
                        }}
                        className="px-2 py-1 absolute flex justify-center items-center mb-16 rounded-sm bg-white border border-slate-300 shadow-md"
                      >
                        <span className="text-zinc-600 font-semibold">
                          LIKE
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          <CreateCommentProfile post={dataPost} />
          {dataPost.comments.length >= 1 && (
            <div
              className={`w-[90%]  overflow-hidden ${
                showAllComments ? "h-fit" : "h-0"
              } flex flex-col gap-2 py-4 mt-4 rounded-md`}
            >
              <div className="w-full flex justify-end items-center pr-4">
                {dataPost.comments.length >= 1 && (
                  <button
                    className="text-xs font-bold transition-colors text-zinc-800 hover:text-zinc-800/60"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "Hide comments" : "Show comments"}
                  </button>
                )}
              </div>
              {dataPost.comments.map((item) => {
                return (
                  <div
                    key={Date.now() * Math.random()}
                    className="w-full pl-4 p-2 rounded-md flex gap-2 items-center"
                  >
                    <span className="font-bold cursor-pointer hover:opacity-80 text-sm">
                      {item.userName}:
                    </span>
                    <p className="font-light text-xs font-medium text-zinc-800/80">
                      {item.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </motion.div>
  );
};

export default function Profile({ userNameProp }: { userNameProp: string }) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { data, loading, fetchDataProfile, updateIsOpen, user } = useStore();

  const [userName, setUserName] = useState<string>(userNameProp);

  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [load, setLoad] = useState<boolean>(false);

  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${URL}/post/byUserName/${userNameProp}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setTotalPosts(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const router = useRouter();

  useEffect(() => {
    setLoad(true);
    setUserName(userName);
    axios
      .get(`${URL}/user/${userName}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetchDataProfile(userName);
  }, []);

  useEffect(() => {
    if (user.token === null) {
      const timeOut = setTimeout(() => {
        router.push("/login");
      }, 2000);

      return () => clearTimeout(timeOut);
    }
  }, [user]);

  return (
    <div
      className={`py-0 md:py-8 flex flex-col min-h-screen h-fit bg-white justify-start items-center`}
    >
      {load === true && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="w-[100%] md:w-[50%] relative h-full flex flex-col justify-center items-center gap-4"
          >
            <div className="w-full h-[200px] relative flex justify-start rounded-sm">
              <div className="w-full h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate absolute">
                <div className="flex flex-col w-full h-full pt-8 pl-10 gap-2">
                  <motion.span
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl text-white/60 tracking-wide font-bold duration-[1500ms] cursor-default transition-colors hover:text-white"
                  >
                    {userProfile?.name}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-white/60 tracking-wide font-bold duration-[1500ms] cursor-default transition-colors hover:text-white"
                  >
                    Posts: {totalPosts}
                  </motion.span>
                </div>
              </div>
              <div className="flex">
                <div className="absolute mt-32 ml-20 bg-white rounded-full border-4 border-white justify-center items-center">
                  <div className="w-32 h-32 rounded-full flex justify-center items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="rounded-full w-[95%] h-[95%] flex justify-center items-center"
                    >
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={`${URL}/${userProfile?.avatar.src}`}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-20 mb-10 flex flex-col justify-center items-center">
              <div className="w-[80%] flex flex-col gap-2 pl-6">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-zinc-800"
                >
                  {userProfile?.name}
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-md font-medium text-zinc-800/80"
                >
                  @{userProfile?.userName}
                </motion.h2>
              </div>
            </div>

            {data?.map((post) => {
              return (
                <Post
                  post={post}
                  userName={userName}
                  key={Math.random() * Math.random()}
                />
              );
            })}
          </motion.div>
          <AnimatePresence>
            {updateIsOpen && <UpdatePostProfile userName={userName} />}
          </AnimatePresence>
          {user.token === null && (
            <div className="fixed w-full h-full">
              <Modal
                text="OPS, você não está conectado, você será redirecionado."
                status="error"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
