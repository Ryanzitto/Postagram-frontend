"use client";
import Aside from "../UI/Aside";
import Feed from "../UI/Feed";
import Header from "../UI/Header";
import { useStore } from "app/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user } = useStore();

  const router = useRouter();

  useEffect(() => {
    if (user.token === "") {
      toast.error("you need to be logged to continue.");
      router.push("/auth/signIn");
    }
  }, []);

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
