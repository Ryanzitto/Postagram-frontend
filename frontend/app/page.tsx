"use client";
import "./globals.css";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, JSX, ReactNode } from "react";

interface topNews {
  banner: string;
  comments: Array<any>;
  id: string;
  likes: Array<any>;
  text: string;
  title: string;
  userName: string;
  map(
    arg0: (news: any) => import("react").JSX.Element
  ): import("react").ReactNode;
}

interface Post {
  post: {
    banner: string;
    comments: Array<any>;
    id: string;
    likes: Array<any>;
    text: string;
    title: string;
    userName: string;
    avatar: string;
    createdAt: string;
  };
}

interface DateFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
}

const Post = ({ post }: Post) => {
  console.log(post);

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
      <div className="w-[90%] h-20 flex justify-start items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-center">
          <div
            className="rounded-full w-[90%] h-[90%]"
            style={{
              backgroundImage: `url(${post.avatar})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-start h-full pt-2 pl-2">
          <span className="text-lg font-bold hover:opacity-80">
            <Link href={`/perfil/${post.userName}`}>{post.userName}</Link>
          </span>
          <span className="text-xs">{dateFormated(post?.createdAt)}</span>
        </div>
      </div>
      <div className="w-[90%] h-fit flex flex-col p-2">
        <h2 className="text-2xl font-black">{post.title}</h2>
        <h2 className="text-sm font-light">{post.text}</h2>
      </div>
      <div className="w-full h-fit flex justify-center items-center">
        <div className="w-[90%] h-fit pt-2">
          <img className="rounded-md" src={post.banner} />
        </div>
      </div>
      <div className="w-[90%] flex justify-end gap-2 pr-2 py-2">
        <button>curtir</button>
      </div>
      <div className="w-[90%] flex flex-col gap-2">
        {post.comments.map((item) => {
          return (
            <div className="w-full pl-4 bg-zinc-200 p-2 rounded-md flex gap-2">
              <span className="font-bold cursor-pointer hover:opacity-80">
                {item.userName}:
              </span>
              <p className="font-light">{item.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Home() {
  const [topNews, setTopNews] = useState<topNews | null>(null);

  const [news, setNews] = useState<topNews | null>(null);

  const baseUrl = "http://localhost:3000";

  useEffect(() => {
    axios
      .get(`${baseUrl}/news/top`)
      .then((response) => {
        console.log(response);
        setTopNews(response.data.news);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseUrl}/news`)
      .then((response) => {
        console.log(response);
        setNews(response.data.results);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-center items-center">
      <div className="w-[50%] h-full flex flex-col gap-4 p-2 pt-10">
        {news !== null
          ? news.map((post) => {
              return <Post post={post} />;
            })
          : null}
      </div>
    </main>
  );
}
