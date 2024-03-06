import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import Post from "./Post";
import Preview from "./Preview";
import { useMemo } from "react";
import { useStore } from "app/store";
import Spinner from "./Spinner";
import Spinner2 from "./Spinner2";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
  totalPosts: number;
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
    avatar: string;
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

  const router = useRouter();

  const { user, logout } = useStore();

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

  const [nextUrl, setNextUrl] = useState<string>("");

  const [shouldShowSpinner, setShouldShowSpinner] = useState<boolean>(false);

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * bgColorsForProfile.length);
    return bgColorsForProfile[randomIndex];
  };

  const getRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const randomColors = useMemo(() => {
    return users?.map(() => getRandomColor()) ?? [];
  }, [users]);

  const randomAvatars = useMemo(() => {
    return users?.map(() => getRandomAvatar()) ?? [];
  }, [users]);

  const handleChangeInputContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e?.target?.value);
  };

  const fetchPosts = () => {
    axios
      .get(`${URL}/post/`)
      .then((response) => {
        console.log(response);
        setPosts(response.data.results);
        setNextUrl(response.data.nextUrl);
        setErrorMessage(null);
        setShouldShowSpinner(true);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
        if (error.response.data.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  };

  const fetchMoreData = () => {
    if (nextUrl === null) {
      setShouldShowSpinner(false);
      return;
    }
    let newUrl = URL + nextUrl;
    console.log(newUrl);
    axios
      .get(`${newUrl}`)
      .then((response) => {
        console.log(response);
        if (posts) {
          setPosts([...posts, ...response.data.results]);
        }
        setNextUrl(response.data.nextUrl);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
        if (error.response.data.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          return;
        }
      });
  };

  const handleClickUserName = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  let isMouseDown = false;
  let startXn: number;
  let scrollLeft: number;

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/user/`)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          if (closeButtonModalRef?.current) {
            closeButtonModalRef.current.click();
          }
          return;
        }
      });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (content === "") {
      setContent(null);
    }
  }, [content]);

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
      <div className="w-full md:w-[50%] h-fit flex flex-col p-4 gap-5 items-center">
        <div
          ref={containerRef}
          className="w-full custom overflow-hidden flex gap-2  rounded-xl border border-zinc-500/80 bg-zinc-700/50 py-3"
        >
          {users && (
            <div className="w-full flex gap-2 px-4">
              {users?.map((user, index) => {
                return (
                  <div
                    key={user._id}
                    className="h-20 w-fit flex flex-col justify-start items-center cursor-default"
                  >
                    <div className="w-20 h-20 flex flex-col justify-center items-center text-center">
                      <div
                        className={`w-12 h-12 p-0.5 flex justify-center items-center ${randomColors[index]} rounded-md`}
                      >
                        <img
                          className="w-12 h-12"
                          src={`/images/${user.avatar}`}
                          alt={`Avatar de ${user.name}`}
                        />
                      </div>
                    </div>
                    <span
                      onClick={() => handleClickUserName(user.userName)}
                      className="cursor-pointer text-xs text-center text-white/50 mt-2 transition-all hover:text-white/30"
                    >
                      {user.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {!users && (
            <div className="w-full flex justify-center items-center">
              <Spinner2 />
            </div>
          )}
        </div>
        <div className="w-full h-fit bg-zinc-700/50 border border-zinc-500/80 rounded-xl flex p-4">
          <div className="w-fit h-fit flex items-center">
            <div className="w-16 h-16 grid rounded-xl">
              {pageIsLoad && (
                <img className="w-15 h-15" src={`/images/${user.avatar}`} />
              )}
            </div>
          </div>
          <div
            onChange={handleChangeInputContent}
            className="w-full h-fit flex flex-col px-4 items-end gap-3"
          >
            <Dialog.Trigger className="w-full">
              <textarea
                onClick={() => setContent("")}
                value={content !== null ? content : ""}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your words today?"
                className={`text-sm flex justify-center items-center rounded-xl w-full pb-4 md:pb-0 pt-5 ${
                  content !== null ? "pb-5" : null
                } pl-4 md:pl-10  h-fit bg-zinc-800/60 outline-none text-white/50 placeholder:text-white/30 `}
              />
            </Dialog.Trigger>
          </div>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
            <Dialog.Content className="relative w-[380px] sm:w-[500px] h-[450px] sm:h-fit bg-zinc-800 border border-zinc-600 rounded-lg">
              <Dialog.Close className="absolute z-60 right-0 top-0 bg-zinc-700/50 transition-all p-2 px-4 rounded-tr-lg text-white/50 hover:text-white/80 hover:bg-purple-500">
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
            return <Post key={post._id} post={post} />;
          })}
          {errorMessage ? (
            <div className="w-full h-60 flex justify-center items-center">
              <p className="text-white/50 font-bold tracking-wider text-lg">
                {errorMessage}
              </p>
            </div>
          ) : null}
        </div>
        <div className="w-full flex justify-center items-center relative h-fit py-6">
          {shouldShowSpinner && <Spinner fetchMoreData={fetchMoreData} />}

          {nextUrl === null && (
            <span className="text-white/50 text-sm"> No more posts.</span>
          )}
        </div>
      </div>
    </Dialog.Root>
  );
}
