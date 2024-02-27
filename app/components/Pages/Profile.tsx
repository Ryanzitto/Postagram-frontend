"use client";

import Header from "../UI/Header";
import axios from "axios";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import Post from "../UI/Post";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import Preview from "../../components/UI/Preview";
import { Plus, Minus } from "lucide-react";
import { useStore } from "app/store";
import { toast } from "sonner";

interface textColors {
  textColor: string;
  bgColor: string;
}

interface Props {
  userNameProp: string;
}

interface Comment {
  comment: string;
  createdAt: string;
  idComment: string;
  userId: string;
  userName: string;
}

interface User {
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
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

export default function ProfilePage({ userNameProp }: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { user } = useStore();

  const router = useRouter();

  const [userProfile, setUserProfile] = useState<User>();

  const [posts, setPosts] = useState<Post[]>();

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [userHasFollowed, setUserHasFollowed] = useState<boolean>();

  useEffect(() => {
    if (userProfile) {
      setUserHasFollowed(
        userProfile?.followers.some(
          (userProfile) => userProfile._id === user._id
        )
      );
    }
  }, [userProfile]);

  const handleClickUserName = (username: string) => {
    router.push(`/perfil/${username}`);
  };

  useEffect(() => {
    axios
      .get(`${URL}/user/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(userNameProp);
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/post/byUserName/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setTotalPostsUser(response.data.length);
        setPosts(response.data);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  const [shouldShowCreatePost, sethouldShowCreatePost] =
    useState<boolean>(false);

  const [content, setContent] = useState<string | null>(null);

  const handleChangeInputContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e?.target?.value);
  };

  const [bgColorSelected, setBgColorSelected] = useState<string>("bg-white");

  const [textColorSelected, setTextColorSelected] = useState<textColors>({
    textColor: "text-black",
    bgColor: "bg-black",
  });

  const closeButtonModalRef = useRef<HTMLSpanElement | null>(null);

  const fetchPosts = () => {
    axios
      .get(`${URL}/post/byUserName/${userProfile?.userName}`)
      .then((response) => {
        console.log(response);
        setPosts(response.data);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    if (content === "") {
      setContent(null);
    }
  }, [content]);

  const handleClickFollow = (userToFollowId: string | undefined) => {
    axios
      .post(`${URL}/user/follow/${userToFollowId}`, { userId: user._id })
      .then((response) => {
        console.log(response);
        toast.success("User successfully followed");
      })
      .catch((error) => {
        console.log(error);
        toast.success("Something wrog ocurred");
      });
  };

  return (
    <Dialog.Root>
      <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-start overflow-x-hidden">
        <Header />
        <div className="w-full h-[85%] flex justify-start items-start">
          <div className="w-[30%] h-full flex flex-col items-center pt-6">
            <div className="relative min-w-[350px] min-h-[400px] flex flex-col justify-center rounded-lg bg-zinc-700/50 border border-zinc-500/80 items-center">
              <div className="w-full flex h-full flex-col justify-start items-center absolute">
                <div className="w-24 h-24 flex justify-center items-center rounded-lg bg-white mt-16">
                  <img
                    className="w-18 h-18"
                    src={`/images/${userProfile?.avatar}`}
                  />
                </div>
                <div className="w-full h-fit flex flex-col justify-center items-center">
                  <div className="flex flex-col justify-center items-center gap-1 mt-2">
                    <span className="text-white font-bold tracking-widest">
                      {userProfile?.name}
                    </span>
                    <span className="text-white/50 text-xs ">
                      @{userProfile?.userName}
                    </span>
                  </div>
                  <div className="w-[300px] h-fit flex px-2 mt-4">
                    <div className="flex w-1/3 flex-col gap-1 text-center">
                      <span className="text-white text-xs font-bold">
                        Posts
                      </span>
                      <span className="text-white/50 text-xs">
                        {totalPostsUser}
                      </span>
                    </div>
                    <div className="flex w-1/3 flex-col gap-1 text-center">
                      <span className="text-white text-xs font-bold">
                        Followers
                      </span>
                      <span className="text-white/50 text-xs">
                        {userProfile?.followers.length}
                      </span>
                    </div>
                    <div className="flex w-1/3 flex-col gap-1 text-center">
                      <span className="text-white text-xs font-bold">
                        Following
                      </span>
                      <span className="text-white/50 text-xs">
                        {userProfile?.following.length}
                      </span>
                    </div>
                  </div>
                  <div className="w-[80%] h-[1px] bg-zinc-500/30 mt-4 mb-4"></div>
                  <div className="w-full flex flex-col justify-center items-center text-center h-fit px-2 mt-2">
                    <span className="text-xs z-40 text-white/80 font-normal">
                      Hi, Im Leon Arc and I love this App. 🛸👽
                    </span>
                  </div>
                  {userProfile?._id !== user._id && (
                    <div className="flex w-full justify-center items-center gap-3 mt-6">
                      {userHasFollowed ? (
                        <button
                          onClick={() => handleClickFollow(userProfile?._id)}
                          className="bg-red-500 transition-all hover:bg-red-600 px-2 py-1.5 text-white rounded-md text-sm font-semibold tracking-wider"
                        >
                          UNFOLLOW
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClickFollow(userProfile?._id)}
                          className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-sm font-semibold tracking-wider"
                        >
                          FOLLOW
                        </button>
                      )}

                      <button className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-sm font-semibold tracking-wider">
                        CHAT
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full h-[30%] flex flex-col justify-center items-center rounded-t-lg bg-purple-500"></div>
              <div className="w-full h-[70%] flex flex-col justify-center items-center rounded-b-lg "></div>
            </div>
            <div className="w-full h-fit flex flex-col gap-4 mt-4">
              <div className="flex flex-col w-full gap-2  h-fit pl-8">
                <span className="text-white/50 text-xs">Following:</span>
                <div className="w-full flex gap-2 flex-wrap">
                  {userProfile?.following.map((user) => {
                    return (
                      <span
                        onClick={() => handleClickUserName(user.userName)}
                        className="text-white/80 text-xs cursor-pointer transition-all hover:text-white/50 hover:underline"
                      >
                        @{user.userName}
                      </span>
                    );
                  })}
                </div>
                {userProfile?.following.length === 0 && (
                  <div className="w-full flex">
                    <span className="text-white/80 text-xs cursor-pointer transition-all hover:text-white/50 hover:underline">
                      {userProfile?.following.length}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full gap-2  h-fit pl-8">
                <span className="text-white/50 text-xs">Following:</span>
                <div className="w-full flex gap-2 flex-wrap">
                  {userProfile?.following.map((user) => {
                    return (
                      <span
                        onClick={() => handleClickUserName(user.userName)}
                        className="text-white/80 text-xs cursor-pointer transition-all hover:text-white/50 hover:underline"
                      >
                        @{user.userName}
                      </span>
                    );
                  })}
                </div>
                {userProfile?.followers.length === 0 && (
                  <div className="w-full flex">
                    <span className="text-white/80 text-xs cursor-pointer transition-all hover:text-white/50 hover:underline">
                      {userProfile?.followers.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[70%] h-full max-h-full flex justify-start items-start pt-6">
            <div className="rounded-lg w-[700px] h-fit flex flex-col items-start justify-start">
              <div className="flex flex-col w-full">
                {userProfile?._id === user._id && (
                  <div className="w-full h-fit flex">
                    <button
                      className={`${
                        shouldShowCreatePost
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-purple-500 hover:bg-purple-600"
                      } transition-all  px-2 rounded-md py-2 flex gap-1 justify-center items-center`}
                      onClick={() =>
                        sethouldShowCreatePost(!shouldShowCreatePost)
                      }
                    >
                      {shouldShowCreatePost ? (
                        <Minus className="w-5 h-5 text-white/80" />
                      ) : (
                        <Plus className="w-5 h-5 text-white/80" />
                      )}
                      <span
                        className={`${
                          shouldShowCreatePost ? "hidden" : "flex"
                        } text-sm text-white/80 font-semibold tracking-wider`}
                      >
                        Create
                      </span>
                    </button>
                  </div>
                )}
                {shouldShowCreatePost && (
                  <div className="w-full h-fit bg-zinc-700/50 border border-zinc-500/80 rounded-xl flex p-4 mt-4">
                    <div className="w-fit h-fit flex">
                      <div className="w-16 h-16 grid bg-purple-500 rounded-md">
                        <img
                          className="w-full h-full"
                          src={`/images/${userProfile?.avatar}`}
                        />
                      </div>
                    </div>
                    <div
                      onChange={handleChangeInputContent}
                      className="w-full h-fit flex flex-col px-4 items-end gap-3"
                    >
                      <textarea
                        value={content !== null ? content : ""}
                        onChange={(e) => setContent(e.target.value)}
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
                )}
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
              </div>
              <div className="flex flex-col w-full ">
                <div className="w-full flex pl-4">
                  {totalPostsUser > 0 && (
                    <span
                      className={`${
                        userProfile?._id === user._id ? "pt-10" : "pt-0"
                      } text-white/10 text-xs `}
                    >
                      Recents Posts
                    </span>
                  )}
                </div>
                <div className="w-full h-fit flex flex-col gap-4 justify-start items-start pt-3 py-6">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </Dialog.Root>
  );
}
