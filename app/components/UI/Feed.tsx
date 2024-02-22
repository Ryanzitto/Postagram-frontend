import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import Post from "./Post";
import Preview from "./Preview";

interface User {
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
}

interface Post {
  subject: string;
  text: string;
  bgColor: string;
  textColor: string;
  likes: [];
  comments: [];
  user: {
    name: string;
    userName: string;
    createdAt: string;
  };
  _id: string;
}

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

  const closeButtonModalRef = useRef<HTMLSpanElement | null>(null);

  const [users, setUsers] = useState<User[] | null>(null);

  const [posts, setPosts] = useState<Post[] | null>(null);

  const [content, setContent] = useState<string | null>(null);

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
      })
      .catch((error) => {
        console.log(error);
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

  return (
    <Dialog.Root>
      <div className="w-[50%] h-fit flex flex-col p-4 gap-5">
        <div className="w-full h-fit flex gap-2">
          {users?.map((user) => {
            return (
              <div
                key={user._id}
                className="h-20 w-fit flex flex-col justify-center items-center"
              >
                <div className="w-20 h-20 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 p-0.5 flex justify-center items-center bg-purple-500 rounded-md">
                    <img
                      className="w-12 rounded-md"
                      src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
                    />
                  </div>
                </div>
                <span className="text-xs text-white/50 mt-4">{user.name}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full h-fit bg-zinc-700/50 rounded-xl flex p-4">
          <div className="w-fit h-fit flex">
            <div className="bg-li w-12 h-12 p-0.5 flex justify-center items-center bg-zinc-800/60 rounded-md">
              <img
                className="w-12 rounded-md"
                src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
              />
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
        </div>
      </div>
    </Dialog.Root>
  );
}
