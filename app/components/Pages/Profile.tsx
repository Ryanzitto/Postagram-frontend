"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
import { Modal } from "../General/Modal";

import { useEffect, useState } from "react";
import { useStore } from "app/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import axios from "axios";
import Link from "next/link";

import UpdatePostProfile from "app/components/Forms/updatePostProfile";
import Spinner from "app/components/Spinner";
import CreateCommentProfile from "../Forms/createCommentProfile";

import { createBioSchema } from "../../zodSchema/createBio";

interface User {
  avatar: {
    src: string;
    _id: string;
  };
  email: string;
  name: string;
  userName: string;
  id: string;
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

type FormData = z.infer<typeof createBioSchema>;

const Post = ({ post, userName }: Props) => {
  const {
    user,
    loading,
    fetchDataProfile,
    setUpdateIsOpen,
    updateIsOpen,
    setCurrentPostUpdatingId,
  } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const [dataPost, setDataPost] = useState<Post>(post);

  const [userHasLiked, setUserHasLiked] = useState<boolean>(
    post.likes.some((obj) => obj.userId === user._id)
  );

  const like = () => {
    const baseUrl = "https://postagram-p8hh.onrender.com";
    axios
      .patch(
        `${baseUrl}/post/like/${post._id}`,
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
    const baseUrl = "https://postagram-p8hh.onrender.com";

    const data = {
      idPicture: _idPicture,
    };
    axios
      .delete(`${baseUrl}/post/${_id}`, {
        data,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setShowModal(false);
        const timeout = setTimeout(() => {
          fetchDataProfile(userName);
        }, 1200);
        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
      });
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
    const baseUrl = "https://postagram-p8hh.onrender.com";
    axios
      .get(`${baseUrl}/post/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setDataPost(response.data.posts);
        setUserHasLiked(!userHasLiked);
      })
      .catch((error) => {
        console.log(error);
      });
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
                  src={`https://postagram-p8hh.onrender.com/${user.avatar.src}`}
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
                className="rounded-md"
                src={"https://postagram-p8hh.onrender.com/" + dataPost.banner.src}
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
                    className="gap-4 absolute w-[250px] h-fit py-4 px-2 rounded-md border border-slate-300 flex flex-col bg-white text-center"
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
                    <img
                      onClick={() => setShowModal(true)}
                      className="cursor-pointer h-5 w-5 transition-colors transition-colors hover:opacity-80"
                      src="https://cdn-icons-png.flaticon.com/128/6590/6590956.png"
                    />
                    <img
                      onClick={handleClickUpdate}
                      className="cursor-pointer h-4 w-4 transition-colors transition-colors hover:opacity-80"
                      src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                    />
                  </>
                )}

                <div className="flex justify-center items-center gap-1">
                  <span>{dataPost.likes.length}</span>
                  <img
                    onClick={like}
                    className="cursor-pointer h-6 w-6"
                    src={
                      userHasLiked === true
                        ? "https://cdn-icons-png.flaticon.com/128/2589/2589175.png"
                        : "https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
                    }
                  />
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
  const { data, loading, fetchDataProfile, updateIsOpen, user } = useStore();

  const [userName, setUserName] = useState<string>(userNameProp);

  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [load, setLoad] = useState<boolean>(false);

  const [showBioForm, setShowBioForm] = useState<boolean>(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createBioSchema),
  });

  async function onSubmit(dataPost: FormData) {
    const baseUrl = "https://postagram-p8hh.onrender.com";

    axios
      .put(`${baseUrl}/user/${user?._id}`, dataPost, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((response) => {
        setUserName(userName);
        const baseUrl = "https://postagram-p8hh.onrender.com";
        axios
          .get(`${baseUrl}/user/${userName}`)
          .then((response) => {
            console.log(response);
            setUserProfile(response.data);
          })
          .catch((error) => console.log(error));

        fetchDataProfile(userName);
        setShowBioForm(false);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setUserName(userName);
    const baseUrl = "https://postagram-p8hh.onrender.com";
    axios
      .get(`${baseUrl}/user/${userName}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
      })
      .catch((error) => console.log(error));

    fetchDataProfile(userName);
  }, []);

  useEffect(() => {
    setLoad(true);
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
      className={`flex flex-col min-h-screen h-fit ${
        updateIsOpen ? "py-0" : "py-8"
      } bg-white justify-start items-center`}
    >
      {load === true && (
        <div className="sm:w-[80%] md:w-[50%] relative h-full flex flex-col justify-center items-center gap-4">
          <div
            className="bg-blue-500 w-full h-[200px] relative flex justify-start relative rounded-sm"
            style={{
              backgroundImage:
                "url('https://www.pixground.com/clouds-meet-the-sea-ai-generated-4k-wallpaper/?download-img=hd')",
              backgroundSize: "cover",
            }}
          >
            <div className="w-full h-10 absolute flex justify-end items-center pr-4 pt-4">
              <div className="w-8 h-8 bg-white/60 rounded-full flex justify-center items-center cursor-pointer hover:bg-white/90">
                <img
                  className="w-4 h-4"
                  src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                />
              </div>
            </div>
            <div className="flex">
              <div className="absolute mt-32 ml-20 bg-zinc-800 rounded-full border-4 border-zinc-800 justify-center items-center">
                <div
                  className="w-32 h-32 rounded-full flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${userProfile?.avatar})`,
                    backgroundSize: "cover",
                  }}
                >
                  <div className="rounded-full w-[95%] h-[95%] flex justify-center items-center">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={`https://postagram-p8hh.onrender.com/${userProfile?.avatar.src}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-20 mb-10 flex flex-col justify-center items-center">
            <div className="w-[80%] flex flex-col gap-2 pl-6">
              <h1 className="text-3xl font-bold text-zinc-800">
                {userProfile?.name}
              </h1>
              <h2 className="text-md font-medium text-zinc-800/80">
                @{userProfile?.userName}
              </h2>
            </div>

            <AnimatePresence>
              {showBioForm === true && (
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
                    scale: 0.8,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: 0,
                  }}
                  className="w-[80%] pl-6 flex pt-4 items-center"
                >
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                  >
                    <label className="font-bold text-zinc-800/60 tracking-wide">
                      Write a new Bio:
                    </label>
                    <input
                      {...register("bio", { required: true })}
                      id="bio"
                      name="bio"
                      placeholder="Tell about you"
                      autoComplete="off"
                      type="text"
                      className="border border-transparent border-b-slate-300 focus:outline-none text-zinc-800 font-medium"
                    ></input>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-zinc-800 text-white rounded-md transition-colors hover:bg-zinc-600"
                    >
                      Send
                    </button>
                    {errors?.bio && (
                      <p className="text-red-600 text-xs pt-2">
                        {errors?.bio?.message}
                      </p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {showBioForm === false && (
              <div className="w-[80%] flex gap-2 items-center pl-6 rounded-md text-sm pt-8">
                <span className="text-zinc-800/80 font-medium">
                  {userProfile?.bio}
                </span>
                <img
                  onClick={() => setShowBioForm(true)}
                  className="w-3 h-3 transition-colors hover:opacity-60 cursor-pointer"
                  src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                />
              </div>
            )}
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
        </div>
      )}
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
    </div>
  );
}
