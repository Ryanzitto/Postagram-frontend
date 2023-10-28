"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useStore } from "app/store";

import UpdateNewsProfile from "app/components/updateNewsProfile";
import Spinner from "app/components/Spinner";

import CreateComment from "app/components/createComment";

interface User {
  avatar: string;
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
  post: {
    banner: string;
    comments: Array<any>;
    id: string;
    likes: Array<any>;
    text: string;
    title: string;
    createdAt: string;
    user: {
      avatar: string;
      email: string;
      name: string;
      userName: string;
      id: string;
    };
  };
}

interface Props {
  post: {
    banner: string;
    comments: Array<any>;
    id: string;
    _id?: string;
    likes: Array<any>;
    text: string;
    title: string;
    createdAt: string;
    user: {
      avatar: string;
      email: string;
      name: string;
      userName: string;
      id: string;
    };
  };
  userName: string;
}

const Post = ({ post, userName }: Props) => {
  useEffect(() => {
    console.log(post);
  }, []);
  const { user, loading, fetchDataProfile, updateIsOpen, setUpdateIsOpen } =
    useStore();

  const [load, setLoad] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  const userHasLiked = post.likes.some((obj) => obj.userId === user._id);

  const like = () => {
    const baseUrl = "http://localhost:3000";
    axios
      .patch(
        `${baseUrl}/news/like/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        fetchDataProfile(userName);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePost = (_id: string | undefined) => {
    const baseUrl = "http://localhost:3000";
    axios
      .delete(`${baseUrl}/news/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setShowModal(false);
        const timeout = setTimeout(() => {
          console.log(userName);
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

    const data = new Date(dataOriginal);

    const options: DateFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const result = data.toLocaleDateString("pt-BR", options);
    return result;
  };

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className="flex flex-col h-fit bg-white justify-start items-center relative rounded-md hover:bg-zinc-200/30 py-6 text-zinc-800 border border-slate-300">
      {load === true && loading === false ? (
        <>
          <div className="w-[90%] h-20 flex justify-start items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
              <img
                className="flex rounded-full w-[90%] h-[90%]"
                src={post?.user?.avatar}
              />
            </div>

            <div className="flex flex-col items-start h-full pt-2 pl-2">
              <span className="text-lg font-bold hover:opacity-80">
                <Link href={`/perfil/${post?.user?.userName}`}>
                  {post?.user?.userName}
                </Link>
              </span>
              <span className="text-xs">{dateFormated(post?.createdAt)}</span>
            </div>
          </div>
          <div className="w-[90%] h-fit flex flex-col p-2">
            <h2 className="text-2xl font-black">{post.title}</h2>
            <h2 className="text-sm font-light">{post.text}</h2>
          </div>
          <div className="w-full h-fit flex justify-center items-center">
            <div className="w-[90%] h-fit pt-2 flex justify-center items-center">
              <img className="rounded-md" src={post.banner} />
            </div>
          </div>
          <div className="w-[90%] flex justify-end items-center gap-4 h-16 pr-2 py-1">
            <div className="rounded-full p-2 transition-colors cursor-pointer relative flex justify-center items-center">
              {showModal && (
                <div className="gap-4 absolute w-[250px] h-fit py-4 px-2 rounded-md border border-slate-300 flex flex-col bg-white text-center">
                  <span className="text-xs font-bold">
                    Are you sure to delete this post?
                  </span>
                  <div className="flex w-full justify-center items-center gap-4">
                    <button
                      onClick={() => deletePost(post._id)}
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
                </div>
              )}
              <div className="w-[90%] flex justify-end items-center gap-6 h-16 pr-2 py-1">
                {user?.id === post?.user?.id && (
                  <>
                    <img
                      onClick={() => setShowModal(true)}
                      className="cursor-pointer h-5 w-5 transition-colors transition-colors hover:opacity-80"
                      src="https://cdn-icons-png.flaticon.com/128/6590/6590956.png"
                    />
                    <img
                      onClick={() => setUpdateIsOpen(true)}
                      className="cursor-pointer h-4 w-4 transition-colors transition-colors hover:opacity-80"
                      src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                    />
                  </>
                )}

                <div className="flex justify-center items-center gap-1">
                  <span>{post.likes.length}</span>
                  <img
                    onClick={like}
                    className="cursor-pointer h-6 w-6"
                    src={
                      userHasLiked
                        ? "https://cdn-icons-png.flaticon.com/128/2589/2589175.png"
                        : "https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <CreateComment post={post} />
          {post.comments.length >= 1 && (
            <div
              className={`w-[90%]  overflow-hidden ${
                showAllComments ? "h-fit" : "h-0"
              } flex flex-col gap-2 py-4 mt-4 rounded-md`}
            >
              <div className="w-full flex justify-end items-center pr-4">
                {post.comments.length >= 1 && (
                  <button
                    className="text-xs font-bold transition-colors text-zinc-800 hover:text-zinc-800/60"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "Hide comments" : "Show comments"}
                  </button>
                )}
              </div>
              {post.comments.map((item) => {
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
    </div>
  );
};

export default function Perfil({ params }: { params: { userName: string } }) {
  const { data, loading, fetchDataProfile, updateIsOpen } = useStore();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [userName, setUserName] = useState<string | null>(params.userName);

  const [user, setUser] = useState<User | null>(null);

  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    setUserName(params.userName);
    const baseUrl = "http://localhost:3000";
    axios
      .get(`${baseUrl}/user/${userName}`)
      .then((response) => {
        console.log(response);
        setUser(response.data);
      })
      .catch((error) => console.log(error));

    fetchDataProfile(params.userName);
  }, []);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen h-fit ${
        updateIsOpen ? "py-0" : "py-8"
      } bg-white justify-start items-center`}
    >
      {load === true && (
        <div className="w-[50%] h-full flex flex-col justify-start gap-4">
          <div
            className="bg-blue-500 w-full h-[200px] relative flex justify-start items-end relative rounded-sm"
            style={{
              backgroundImage:
                "url('https://www.pixground.com/clouds-meet-the-sea-ai-generated-4k-wallpaper/?download-img=hd')",
              backgroundSize: "cover",
            }}
          >
            <div className="flex">
              <div className="absolute -mt-16 ml-20 bg-zinc-800 rounded-full border-4 border-zinc-800 justify-center items-center">
                <div
                  className="w-32 h-32 rounded-full"
                  style={{
                    backgroundImage: `url(${user?.avatar})`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="w-full mt-20 flex flex-col justify-center items-center">
            <div className="w-[80%] flex flex-col gap-2 pl-6">
              <h1 className="text-3xl font-bold text-zinc-800">{user?.name}</h1>
              <h2 className="text-md font-medium text-zinc-800/80">
                @{user?.userName}
              </h2>
            </div>
            <div className="w-[80%] pt-6 flex pl-6">
              <form>
                <label className="font-bold text-zinc-800/60 tracking-wide">
                  Bio:
                </label>
                <input
                  // {...register("title", { required: true })}
                  id="title"
                  name="title"
                  placeholder="Tell about you"
                  autoComplete="off"
                  type="text"
                  className="border border-transparent border-b-slate-300 focus:outline-none pl-4 text-zinc-800 font-medium"
                ></input>
              </form>
            </div>
            <div className="w-[80%] pl-6 rounded-md text-sm pt-2">
              {user?.bio}
            </div>
          </div>
          {data?.map((post) => {
            return (
              <Post
                post={post}
                userName={params.userName}
                key={Math.random() * Math.random()}
              />
            );
          })}
        </div>
      )}
      {updateIsOpen && <UpdateNewsProfile userName={params.userName} />}
    </div>
  );
}
