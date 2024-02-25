"use client";
import Aside from "../UI/Aside";
import Feed from "../UI/Feed";
import Header from "../UI/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function HomePage() {
  return (
    <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-start overflow-x-hidden">
      <Header />
      <div className="w-full h-[85%] flex justify-start items-start">
        <Aside />
        <Feed />
        <div className="w-[25%] flex-wrap gap-2 flex h-full p-6"></div>
      </div>
    </main>
  );
}
