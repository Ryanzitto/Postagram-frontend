"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { Post } from "../Post";

import Spinner from "../Spinner";
import CreateNews from "../Forms/createNews";

import Uploader from "../General/Uploader";

interface Post {
  avatar: string;
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
  const { nextUrl, previousUrl, data, totalPosts, fetchData } = useStore();

  const [posts, setPosts] = useState(data);

  const postsPorPagina = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const [numeroDePáginas, setNumeroDePáginas] = useState<number | null>(null);

  const next = () => {
    if (nextUrl !== null) {
      fetchData("http://localhost:3000" + nextUrl);
      //@ts-ignore
      if (currentPage < numeroDePáginas) {
        setCurrentPage((numeroDePáginas) => numeroDePáginas + 1);
      }
    }
  };

  const prev = () => {
    if (previousUrl !== null) {
      fetchData("http://localhost:3000" + previousUrl);
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

const Alert = (props: { status: string; text: string }) => {
  const { status, text } = props;

  const [killAlert, setKillAlert] = useState<boolean>(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setKillAlert(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  return (
    <div className="w-screen h-40 rounded-md fixed flex items-center pl-4">
      <div className="w-80 h-[90%] bg-green-200 border border-green-300 flex rounded-md flex flex-col gap-4">
        <span className="ml-4 mt-4 text-green-600 font-bold">SUCESSO!</span>
        <div className="w-full h-full flex border-t border-green-300 items-center">
          <p className="ml-4 text-sm text-green-500 font-medium">{text}</p>
        </div>
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
    updateIsOpen,
    setUpdateIsOpen,
  } = useStore();

  const router = useRouter();

  const [load, setLoad] = useState<boolean>(false);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    fetchData("http://localhost:3000/news");
  }, []);

  useEffect(() => {
    setLoad(true);
    setCreateIsOpen(false);
    setUpdateIsOpen(false);
  }, []);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <main className="flex flex-col min-h-screen h-fit bg-white justify-start items-center relative">
      {load === true && (
        <>
          <div className="w-[50%] h-full flex flex-col items-center gap-4 p-2 relative">
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
                return <Post _id={post._id} key={post._id} />;
              })
            ) : (
              <Spinner />
            )}
            <PostsList />
          </div>
          {createIsOpen && <CreateNews />}
        </>
      )}
    </main>
  );
}
