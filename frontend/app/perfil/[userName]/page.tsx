"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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

const Post = ({ post }: Post) => {
  const [load, setLoad] = useState<boolean>(false);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);

  useEffect(() => {
    setLoad(true);
  }, []);

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

  return (
    <div className="w-full h-fit rounded-md flex items-center flex-col hover:bg-zinc-200/30 py-6 text-zinc-800">
      {load === true && (
        <>
          <div className="w-[90%] h-20 flex justify-start items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
              <div
                className="rounded-full w-[90%] h-[90%]"
                style={{
                  backgroundImage: `url(${post.user.avatar})`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>

            <div className="flex flex-col items-start h-full pt-2 pl-2">
              <span className="text-lg font-bold hover:opacity-80">
                <Link href={`/perfil/${post?.user.userName}`}>
                  {post?.user.userName}
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
            <div className="bg-zinc-300 rounded-full p-2 transition-colors hover:bg-zinc-200 cursor-pointer">
              <img
                className="cursor-pointer h-6 w-6"
                src="https://cdn-icons-png.flaticon.com/128/3138/3138336.png"
              />
            </div>
            <div className="bg-zinc-300 rounded-full p-2 transition-colors hover:bg-zinc-200 cursor-pointer">
              <img
                className="cursor-pointer h-6 w-6"
                src="https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
              />
            </div>
          </div>
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
      )}
    </div>
  );
};

export default function Perfil({ params }: { params: { userName: string } }) {
  const [userName, setUserName] = useState<string | null>(params.userName);

  const [user, setUser] = useState<User | null>(null);

  const [posts, setPosts] = useState<Post[] | null>(null);

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

    axios
      .get(`${baseUrl}/news/byUserName/${userName}`)
      .then((response) => {
        console.log(response);
        setPosts(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);
  return (
    <div className="flex flex-col min-h-screen h-fit py-8 bg-white justify-start items-center">
      <div className="w-[50%] h-full flex flex-col justify-start gap-4">
        <div
          className="bg-blue-500 w-full h-[200px] relative flex justify-start items-end relative"
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
          <div className="w-[80%] pl-6 rounded-md text-sm pt-2">
            {user?.bio}
          </div>
        </div>
        {posts?.map((post) => {
          //@ts-ignore
          return <Post post={post} key={Date.now() * Math.random()} />;
        })}
      </div>
    </div>
  );
}
