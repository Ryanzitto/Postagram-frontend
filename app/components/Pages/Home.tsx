"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStore } from "../../store";
import { Modal } from "../General/Modal";
import { Post } from "../Post";
import CreatePost from "../Forms/createPost";
import Spinner from "../Spinner";

interface Post {
  avatar: {
    src: string;
    _id: string;
  };
  banner: {
    src: string;
    _id: string;
  };
  comments: [any];
  createdAt: string;
  likes: [any];
  name: string;
  text: string;
  title: string;
  userName: string;
  _id: string;
}

const PostsList = () => {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { nextUrl, previousUrl, data, totalPosts, fetchData } = useStore();

  const postsPorPagina = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const [numeroDePáginas, setNumeroDePáginas] = useState<number | null>(null);

  const next = () => {
    if (nextUrl !== null) {
      fetchData(URL + nextUrl);
      //@ts-ignore
      if (currentPage < numeroDePáginas) {
        setCurrentPage((numeroDePáginas) => numeroDePáginas + 1);
      }
    }
  };

  const prev = () => {
    if (previousUrl !== null) {
      fetchData(URL + previousUrl);
      if (currentPage === 1) {
        return;
      } else {
        setCurrentPage((numeroDePáginas) => numeroDePáginas - 1);
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    setNumeroDePáginas(Math.ceil(totalPosts / postsPorPagina));
  }, [totalPosts]);
  return (
    <div className="w-full h-24 flex flex-col justify-center items-center gap-2 ">
      <span className="text-sm font-bold">
        Page: {currentPage}/{numeroDePáginas}
      </span>
      <div className="w-full flex justify-center items-center gap-2 pt-4">
        <button
          onClick={prev}
          className="bg-blue-300 p-2 px-4 rounded-sm text-sm font-medium transition-colors hover:opacity-80 disabled:text-black/20 disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={previousUrl === null ? true : false}
        >
          PREV
        </button>
        <button
          onClick={next}
          className="bg-blue-300 p-2 px-4 rounded-sm text-sm font-medium transition-colors hover:opacity-80 disabled:text-black/20 disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={nextUrl === null ? true : false}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const {
    user,
    data,
    loading,
    fetchData,
    createIsOpen,
    setCreateIsOpen,
    setCurrentPostUpdatingId,
  } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    fetchData(`${URL}/post`);
  }, []);

  useEffect(() => {
    setLoad(true);
    setCreateIsOpen(false);
    setCurrentPostUpdatingId("");
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-start items-center relative">
      {load === true && (
        <>
          <motion.div
            whileInView={"visible"}
            initial={{
              opacity: 0,
            }}
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  duration: 1,
                  delay: 0,
                },
              },
            }}
            className="w-[100%] md:w-[50%] h-full flex flex-col items-center gap-4 p-2 relative"
          >
            <div className="w-full py-4 h-fit border border-slate-300 rounded-md flex">
              <div className="w-[20%] flex justify-center items-center">
                <div className="rounded-full w-16 h-16 bg-zinc-800 flex justify-center items-center">
                  {user !== null && (
                    <img
                      className="rounded-full w-[90%] h-[90%] object-cover"
                      src={user?.avatar?.src}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col w-[80%] justify-start items-start">
                <div
                  onClick={() => setCreateIsOpen(true)}
                  className="cursor-pointer w-[90%] border border-slate-300 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate h-10 rounded-md flex items-center pl-4 transition-colors hover:opacity-80 shadow-md"
                >
                  <span className="font-medium text-white text-sm">
                    Criar publicação
                  </span>
                </div>
              </div>
            </div>
            {loading === false ? (
              data.map((post: Post) => {
                return <Post _id={post._id} key={post._id} />;
              })
            ) : (
              <Spinner />
            )}
            {data.length === 0 && (
              <div className="w-full h-[200px] flex justify-center items-start pt-16">
                <span className="text-2xl text-zinc-800/80 font-bold transition-colors duration-[1500ms] hover:text-zinc-800/60">
                  No post created, how about creating the first one? 😉
                </span>
              </div>
            )}
            {data.length !== 0 && <PostsList />}
          </motion.div>
          <AnimatePresence>{createIsOpen && <CreatePost />}</AnimatePresence>
          {user?.token === null && (
            <div className="fixed w-full h-full">
              <Modal
                text="OPS, você não está conectado, você será redirecionado."
                status="error"
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
