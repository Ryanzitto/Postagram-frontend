"use client";
import Aside from "../UI/Aside";
import Feed from "../UI/Feed";
import Header from "../UI/Header";
import { MoreHorizontal } from "lucide-react";
export default function HomePage() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  return (
    <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-start overflow-x-hidden">
      <Header />
      <div className="w-full h-[85%] flex justify-start items-start">
        <Aside />
        <Feed />
        <div className="w-[25%] flex h-full p-6"></div>
      </div>
    </main>
  );
}
