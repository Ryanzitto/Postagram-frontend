"use client";
import "./globals.css";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect, JSX, ReactNode } from "react";
import { useStore } from "./store";
import { Post } from "./components/Post";

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

export default function Home() {
  const { user } = useStore();

  const [topNews, setTopNews] = useState<topNews | null>(null);

  const [news, setNews] = useState<topNews | null>(null);

  const [load, setLoad] = useState<boolean>(false);

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

  useEffect(() => {
    console.log(user);
  }, []);

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-start items-center relative">
      {load === true && (
        <div className="w-[50%] h-full flex flex-col gap-4 p-2 pt-10">
          <div className="w-full py-4 h-fit border border-slate-300 rounded-md flex">
            <div className="w-[20%] flex justify-center items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
                <div
                  className="rounded-full w-[90%] h-[90%]"
                  style={{
                    backgroundImage: `url(${user?.avatar})`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col w-[80%] justify-start items-start">
              <div className="cursor-pointer w-[90%] border border-slate-300 bg-zinc-100 h-10 rounded-md flex items-center pl-4 transition-colors hover:bg-zinc-200">
                <span className="font-medium text-zinc-600 text-sm">
                  Criar publicação
                </span>
              </div>
            </div>
          </div>
          {news !== null
            ? news.map((post) => {
                return <Post key={Date.now() * Math.random()} post={post} />;
              })
            : null}
        </div>
      )}
      <div className="z-20 absolute flex justify-center items-center w-full h-screen bg-zinc-800/60">
        <div className="w-[500px] h-fit bg-white rounded-md p-4 flex justify-center items-center flex-col ">
          <div className="w-full flex justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
              <div
                className="rounded-full w-[90%] h-[90%]"
                style={{
                  backgroundImage: `url(${user?.avatar})`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          </div>
          <div className="w-[90%] h-fit p-4"></div>
        </div>
      </div>
    </main>
  );
}
