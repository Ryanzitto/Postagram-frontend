"use client";

import "./globals.css";
import axios from "axios";
import { useState, useEffect } from "react";

interface topNews {
  banner: string;
  comments: Array<any>;
  id: string;
  likes: Array<any>;
  text: string;
  title: string;
  userName: string;
}

export default function Home() {
  const [topNews, setTopNews] = useState<topNews | null>(null);
  const [news, setNews] = useState<any>(null);

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
    console.log(topNews);
  }, [topNews]);

  useEffect(() => {
    console.log(news);
  }, [news]);

  return (
    <main className="flex flex-col min-h-screen h-screen bg-zinc-100 justify-start items-start">
      <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div className="w-full h-[500px] flex p-10 gap-4">
        <div className="w-1/2 flex justify-center items-center">
          {topNews !== null && (
            <div
              style={{
                backgroundImage: `url(${topNews.banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full bg-white rounded-md border border-white flex justify-center items-end pb-4"
            >
              <div className="w-[90%] flex flex-col gap-2">
                <p className="text-white font-black tracking-wide text-2xl">
                  {topNews.title}
                </p>
                <p className="text-white font-medium ">{topNews.text}</p>
              </div>
            </div>
          )}
        </div>
        {news !== null && (
          <div className="w-1/2 flex flex-col gap-4 justify-center items-center">
            {news.map((news) => {
              return (
                <div
                  style={{
                    backgroundImage: `url(${news.banner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="w-full h-1/2 bg-white rounded-md border border white flex justify-center items-end pb-4"
                >
                  <div className="w-[90%] flex flex-col gap-2">
                    <p className="text-white font-black tracking-wide text-2xl">
                      {news.title}
                    </p>
                    <p className="text-white font-medium ">{news.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
