"use client";

import Aside from "../UI/Aside";
import Feed from "../UI/Feed";
import Header from "../UI/Header";
import NotificationBar from "../UI/Notification";

export default function HomePage() {
  return (
    <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-center overflow-x-hidden">
      <Header />
      <div className="w-full max-w-[1600px] h-[85%] flex flex-col md:flex-row justify-start items-start">
        <Aside />
        <Feed />
        <div className="w-[25%] flex-wrap gap-2 h-full">
          <NotificationBar />
        </div>
      </div>
    </main>
  );
}
