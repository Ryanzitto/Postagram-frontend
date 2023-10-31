"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { Post } from "../Post";

import Spinner from "../Spinner";
import CreateNews from "../Forms/createNews";
import UpdateNews from "../Forms/updateNews";

interface Post {
  avatar: string;
  banner: string;
  comments: [any];
  createdAt: string;
  likes: [any];
  name: string;
  text: string;
  title: string;
  userName: string;
  _id: string;
}

export default function Home() {
  const {
    user,
    data,
    loading,
    fetchData,
    createIsOpen,
    setCreateIsOpen,
    updateIsOpen,
    setUpdateIsOpen,
  } = useStore();

  const router = useRouter();

  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoad(true);
    setCreateIsOpen(false);
    setUpdateIsOpen(false);
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-start items-center relative">
      {load === true && (
        <>
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
                <div
                  onClick={() => setCreateIsOpen(true)}
                  className="cursor-pointer w-[90%] border border-slate-300 bg-zinc-100 h-10 rounded-md flex items-center pl-4 transition-colors hover:bg-zinc-200"
                >
                  <span className="font-medium text-zinc-600 text-sm">
                    Criar publicação
                  </span>
                </div>
              </div>
            </div>
            {loading === false ? (
              data.map((post: Post) => {
                return <Post post={post} key={post._id} />;
              })
            ) : (
              <Spinner />
            )}
          </div>
          {createIsOpen && <CreateNews />}
          {updateIsOpen && <UpdateNews />}
        </>
      )}
    </main>
  );
}
