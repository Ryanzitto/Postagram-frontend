import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import Post from "./Post";
import Preview from "./Preview";

import { useStore } from "app/store";

interface User {
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
}

interface Comment {
  comment: string;
  createdAt: string;
  idComment: string;
  userId: string;
  userName: string;
}

interface Post {
  subject: string;
  text: string;
  bgColor: string;
  textColor: string;
  likes: [];
  comments: Comment[];
  createdAt: string;
  user: {
    name: string;
    userName: string;
    createdAt: string;
  };
  _id: string;
}

const bgColorsForProfile = [
  "bg-red-300",
  "bg-orange-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-teal-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-300",
  "bg-lime-300",
  "bg-emerald-300",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-red-700",
  "bg-orange-700",
  "bg-yellow-700",
  "bg-green-700",
  "bg-teal-700",
  "bg-blue-700",
  "bg-indigo-700",
  "bg-purple-700",
  "bg-pink-700",
  "bg-lime-700",
  "bg-emerald-700",
];

const images = [
  "images/cat-1.png",
  "images/cat-2.png",
  "images/cat-3.png",
  "images/cat-4.png",
  "images/cat-5.png",
  "images/cat-6.png",
  "images/cat-7.png",
  "images/cat-8.png",
  "images/cat-9.png",
  "images/cat-10.png",
  "images/cat-11.png",
  "images/cat-12.png",
  "images/cat-13.png",
];

const colors = [
  "bg-white",
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-black",
];

const textColors = [
  { textColor: "text-white", bgColor: "bg-white" },
  { textColor: "text-red-500", bgColor: "bg-red-500" },
  { textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
  { textColor: "text-blue-500", bgColor: "bg-blue-500" },
  { textColor: "text-purple-500", bgColor: "bg-purple-500" },
  { textColor: "text-amber-500", bgColor: "bg-amber-500" },
  { textColor: "text-emerald-500", bgColor: "bg-emerald-500" },
  { textColor: "text-black", bgColor: "bg-black" },
];

interface textColors {
  textColor: string;
  bgColor: string;
}

export default function Feed() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user } = useStore();

  const closeButtonModalRef = useRef<HTMLSpanElement | null>(null);

  const [users, setUsers] = useState<User[] | null>(null);

  const [posts, setPosts] = useState<Post[] | null>(null);

  const [content, setContent] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [bgColorSelected, setBgColorSelected] = useState<string>("bg-white");

  const [textColorSelected, setTextColorSelected] = useState<textColors>({
    textColor: "text-black",
    bgColor: "bg-black",
  });

  const handleChangeInputContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e?.target?.value);
  };

  const fetchPosts = () => {
    axios
      .get(`${URL}/post/`)
      .then((response) => {
        console.log(response);
        setPosts(response.data.results);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    axios
      .get(`${URL}/user/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    if (content === "") {
      setContent(null);
    }
  }, [content]);

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * bgColorsForProfile.length);
    return bgColorsForProfile[randomIndex];
  };
  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  let isMouseDown = false;
  let startXn: number;
  let scrollLeft: number;

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const handleMouseDown = (event: MouseEvent) => {
        isMouseDown = true;
        startXn = event.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isMouseDown) return;
        event.preventDefault();
        const x = event.pageX - container.offsetLeft;
        const walk = (x - startXn) * 2; // Ajuste a sensibilidade do movimento conforme necessário
        container.scrollLeft = scrollLeft - walk;
      };

      const handleMouseUp = () => {
        isMouseDown = false;
      };

      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);

      return () => {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, []);

  return (
    <Dialog.Root>
      <div className="w-[50%] h-fit flex flex-col p-4 gap-5">
        <div
          ref={containerRef}
          className="w-full custom overflow-hidden flex gap-2"
        >
          <div className="w-full flex gap-2">
            {users?.map((user) => {
              return (
                <div
                  key={user._id}
                  className="h-20 w-fit flex flex-col justify-start items-center cursor-default"
                >
                  <div className="w-20 h-20 flex flex-col justify-center items-center text-center">
                    <div
                      className={`w-12 h-12 p-0.5 flex justify-center items-center ${getRandomColor()} rounded-md`}
                    >
                      <img className="w-12 h-12" src={getRandomAvatar()} />
                    </div>
                  </div>
                  <span className="cursor-pointer text-xs text-center text-white/50 mt-4">
                    {user.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full h-fit bg-zinc-700/50 rounded-xl flex p-4 mt-4">
          <div className="w-fit h-fit flex">
            <div className="w-16 h-16 flex justify-center items-center bg-pink-500 rounded-md">
              <img className="w-full h-full" src="images/cat-1.png" />
            </div>
          </div>
          <div
            onChange={handleChangeInputContent}
            className="w-full h-fit flex flex-col px-4 items-end gap-3"
          >
            <textarea
              value={content !== null ? content : ""}
              placeholder="What are your words today?"
              className={`text-sm rounded-xl w-full pt-5 ${
                content !== null ? "pb-5" : null
              } pl-10  h-fit bg-zinc-800/60 outline-none text-white/50 placeholder:text-white/30 `}
            />
            <Dialog.Trigger>
              {content !== null && (
                <span className="cursor-pointer text-white/50 text-xs transition-all hover:text-white outline-none">
                  See preview
                </span>
              )}
            </Dialog.Trigger>
          </div>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
            <Dialog.Content className="relative w-[500px] min-h-fit h-fit bg-zinc-800 border border-zinc-600 rounded-lg">
              <Dialog.Close className="absolute right-0 top-0 bg-zinc-700/50 transition-all p-2 px-4 rounded-tr-lg text-white/50 hover:text-white/80 hover:bg-purple-500">
                <span ref={closeButtonModalRef}>X</span>
              </Dialog.Close>
              <Preview
                fetchPosts={fetchPosts}
                closeButtonModalRef={closeButtonModalRef}
                textColorSelected={textColorSelected}
                bgColorSelected={bgColorSelected}
                content={content}
                setContent={setContent}
                setTextColorSelected={setTextColorSelected}
                setBgColorSelected={setBgColorSelected}
              />
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
        <div className="w-full h-fit flex flex-col gap-4 justify-start items-center">
          {posts?.map((post) => {
            return <Post post={post} />;
          })}
          {errorMessage ? (
            <div className="w-full h-60 flex justify-center items-center">
              <p className="text-white/50 font-bold tracking-wider text-lg">
                {errorMessage}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Dialog.Root>
  );
}
