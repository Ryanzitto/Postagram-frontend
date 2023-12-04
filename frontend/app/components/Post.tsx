import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import Lottie from "react-lottie";

import { useStore } from "../store";
import { updatePostSchema } from "../zodSchema/updtadePost";
import { createCommentSchema } from "../zodSchema/createComment";

import Spinner from "./Spinner";

import animationDataOK from "../../public/Animation-OK.json";
import animationDataErro from "../../public/Animation-ERRO.json";

interface DateFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
}

interface Post {
  banner: string;
  comments: Array<any>;
  _id: string;
  likes: Array<any>;
  text: string;
  title: string;
  createdAt: string;
  user: {
    userName: string;
    avatar: string;
    createdAt: string;
  };
}

interface Props {
  post: {
    banner: string;
    comments: Array<any>;
    _id: string;
    likes: Array<any>;
    text: string;
    title: string;
    createdAt: string;
  };
}

interface PostID {
  _id: string;
}
type FormData = z.infer<typeof updatePostSchema>;

type FormDataComment = z.infer<typeof createCommentSchema>;

export const Post = ({ _id }: PostID) => {
  const {
    user,
    setUpdateIsOpen,
    setCurrentPostUpdatingId,
    updateIsOpen,
    currentPostUpdatingId,
    postIsLoading,
  } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  const [post, setPost] = useState<Post | null>(null);

  const [showAllComments, setShowAllComments] = useState(false);

  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);

  useEffect(() => {
    if (post) {
      setUserHasLiked(post.likes.some((obj) => obj.userId === user._id));
    }
  }, [post]);

  const [loadContent, setLoadContent] = useState<boolean>(postIsLoading);

  useEffect(() => {
    console.log(userHasLiked);
  }, []);

  const dateFormated = (date: string) => {
    const dataOriginal = date;

    const data = new Date(dataOriginal);

    const options: DateFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const result = data.toLocaleDateString("pt-BR", options);
    return result;
  };

  const like = () => {
    if (post) {
      const baseUrl = "http://localhost:3000";
      axios
        .patch(
          `${baseUrl}/news/like/${post._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          fetchPost();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchPost = () => {
    const baseUrl = "http://localhost:3000";
    console.log();
    axios
      .get(`${baseUrl}/news/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setPost(response.data.news);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickUpdate = (_id: string) => {
    setCurrentPostUpdatingId(_id);
    setUpdateIsOpen(true);
  };

  useEffect(() => {
    fetchPost();
    setLoad(true);
  }, []);

  useEffect(() => {
    if (currentPostUpdatingId === post?._id) {
      fetchPost();
    }
  }, [currentPostUpdatingId]);

  useEffect(() => {
    setLoadContent(postIsLoading);
  }, [postIsLoading]);

  return (
    <div className="relative w-full h-fit rounded-md flex items-center flex-col hover:bg-zinc-200/30 py-6 text-zinc-800 border border-slate-300">
      {load === true && post ? (
        <>
          {loadContent === true && currentPostUpdatingId === _id ? (
            <Spinner />
          ) : (
            <>
              <div className="w-[90%] h-20 flex items-center">
                <div className="w-[10%]">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
                    <div
                      className="rounded-full w-[90%] h-[90%]"
                      style={{
                        backgroundImage: `url(${post.user?.avatar})`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-[80%]">
                  <div className="flex flex-col items-start h-full pb-3 pl-4">
                    <span className="text-lg font-bold hover:opacity-80">
                      <Link href={`/perfil/${post?.user?.userName}`}>
                        {post?.user?.userName}
                      </Link>
                    </span>
                    <span className="text-xs">
                      {dateFormated(post?.createdAt)}
                    </span>
                  </div>
                </div>
                {/* <div className="w-[10%] mb-10 flex justify-center items-center cursor-pointer relative">
              {configIsOpen && (
                <div className="border border-slate-300 absolute bg-white rounded-md flex w-full h-fit py-2 mt-14 flex justify-center items-center">
                  <span className="text-xs font-bold transition-colors text-zinc-800 hover:text-zinc-800/80">
                    Edit
                  </span>
                </div>
              )}
              <div
                onClick={() => setConfigISOpen(!configIsOpen)}
                className="flex gap-1 py-2"
              >
                <div className="bg-zinc-800 w-1 h-1 rounded-full transition-colors hover:bg-zinc-800/80"></div>
                <div className="bg-zinc-800 w-1 h-1 rounded-full transition-colors hover:bg-zinc-800/80"></div>
                <div className="bg-zinc-800 w-1 h-1 rounded-full transition-colors hover:bg-zinc-800/80"></div>
              </div>
            </div> */}
              </div>
              <div className="w-[90%] h-fit flex flex-col p-2">
                <h2 className="text-2xl font-black">{post.title}</h2>
                <h2 className="text-sm font-light">{post.text}</h2>
              </div>
              <div className="w-full h-fit flex justify-center items-center">
                <div className="w-[90%] h-fit pt-2 flex justify-center items-center">
                  <img className="rounded-md" src={post.banner} />
                </div>
              </div>
              <div className="w-[90%] flex justify-end items-center gap-4 h-16 pr-2 py-1">
                {post?.user?.userName === user.userName && (
                  <img
                    onClick={() => handleClickUpdate(post._id)}
                    className="cursor-pointer h-4 w-4 transition-colors hover:opacity-80"
                    src="https://cdn-icons-png.flaticon.com/128/84/84380.png"
                  />
                )}
                <div className="flex justify-center items-center gap-1">
                  <span>{post.likes.length}</span>
                  <img
                    onClick={like}
                    className="cursor-pointer h-6 w-6"
                    src={
                      userHasLiked
                        ? "https://cdn-icons-png.flaticon.com/128/2589/2589175.png"
                        : "https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
                    }
                  />
                </div>
              </div>
              <CreateComment post={post} />
            </>
          )}

          {post.comments.length >= 1 && (
            <div
              className={`w-[90%]  overflow-hidden ${
                showAllComments ? "h-fit" : "h-0"
              } flex flex-col gap-2 py-4 mt-4 rounded-md`}
            >
              <div className="w-full flex justify-end items-center pr-4">
                {post.comments.length >= 1 && (
                  <button
                    className="text-xs font-bold transition-colors text-zinc-800 hover:text-zinc-800/60"
                    onClick={() => setShowAllComments(!showAllComments)}
                  >
                    {showAllComments ? "Hide comments" : "Show comments"}
                  </button>
                )}
              </div>
              {post.comments.map((item) => {
                return (
                  <div
                    key={Date.now() * Math.random()}
                    className="w-full pl-4 p-2 rounded-md flex gap-2 items-center"
                  >
                    <span className="font-bold cursor-pointer hover:opacity-80 text-sm">
                      {item.userName}:
                    </span>
                    <p className="font-light text-xs font-medium text-zinc-800/80">
                      {item.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Spinner />
      )}
      {updateIsOpen ? <UpdateNews /> : null}
    </div>
  );
};

const CreateComment = ({ post }: Props) => {
  const { user, logout, setCurrentPostUpdatingId, setPostIsLoading } =
    useStore();

  const [inputText, setInputText] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormDataComment>({
    resolver: zodResolver(createCommentSchema),
  });

  async function onSubmit(data: FormDataComment) {
    console.log(data);
    const baseUrl = "http://localhost:3000";
    setPostIsLoading(true);
    axios
      .patch(
        `${baseUrl}/news/comment/${post._id}`,
        {
          comment: data.comment,
          userName: user.userName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setPostIsLoading(false);

        setShowModal(true);
        const timeout = setTimeout(() => {
          setShowModal(false);
          setCurrentPostUpdatingId(post._id);
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        setPostIsLoading(false);
        if (error.response.data.message === "Token has expired") {
          setShowModal(true);
          const timeout = setTimeout(() => {
            router.push("/login");
            logout();
          }, 1200);
          return () => clearTimeout(timeout);
        }
      });
  }

  return (
    <div className="w-[90%] flex justify-center gap-2 pr-2 py-1">
      <div className="w-[10%] flex justify-center items-center">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex justify-center items-center">
          <div
            className="rounded-full w-[90%] h-[90%] cursor-pointer"
            style={{
              backgroundImage: `url(${user?.avatar})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] flex flex-col">
        <div
          //@ts-ignore
          onChange={(e) => setInputText(e.target.value)}
          className="flex gap-4"
        >
          <input
            {...register("comment", { required: true })}
            id="comment"
            name="comment"
            autoComplete="off"
            placeholder="type a comment"
            className="border border-slate-300 h-10 pl-6 focus:outline-none w-full rounded-md"
          ></input>
          {inputText !== null && (
            <button
              type="submit"
              className="px-4 text-xl rounded-md transition-colors font-bold flex justify-center items-center text-zinc-800/50 hover:bg-zinc-200 hover:text-white"
            >
              <img
                className="w-6 h-6"
                src="https://cdn-icons-png.flaticon.com/128/11600/11600263.png"
              />
            </button>
          )}
        </div>
        {errors?.comment && (
          <p className="text-red-600 text-xs pt-2">
            {errors?.comment?.message}
          </p>
        )}
      </form>
    </div>
  );
};

const UpdateNews = () => {
  const { user, logout, fetchData, setUpdateIsOpen, currentPostUpdatingId } =
    useStore();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [svg, setSvg] = useState<string>("ERRO");

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(updatePostSchema),
  });

  async function onSubmit(data: FormData) {
    const baseUrl = "http://localhost:3000";

    axios
      .patch(`${baseUrl}/news/${currentPostUpdatingId}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setShowModal(true);
        setSvg("SUCCESS");
        const timeout = setTimeout(() => {
          setShowModal(false);
          setUpdateIsOpen(false);
          fetchData("http://localhost:3000/news");
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
          setShowModal(true);
          setSvg("ERRO");
          const timeout = setTimeout(() => {
            router.push("/login");
            logout();
          }, 1200);
          return () => clearTimeout(timeout);
        }
      });
  }

  return (
    <div className="z-20 fixed flex justify-center items-center w-full h-screen bg-zinc-800/60 -mt-36">
      <div className="w-[500px] h-fit bg-white rounded-md p-4 flex justify-start items-center flex-col relative">
        {showModal && <Modal svg={svg} />}
        <div className="w-full absolute h-10 flex justify-end pr-4 flex just">
          <button
            onClick={() => setUpdateIsOpen(false)}
            className="p-4 rounded-md  transition-colors bg-zinc-200 font-bold flex justify-center items-center text-zinc-800/50 hover:bg-red-500 hover:text-white"
          >
            X
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] h-fit p-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-zinc-800/60 tracking-wide">
              Title:
            </label>
            <input
              {...register("title", { required: true })}
              id="title"
              name="title"
              placeholder="New title here"
              autoComplete="off"
              type="text"
              className="border border-transparent border-b-slate-300 focus:outline-none pl-4 text-zinc-800 font-medium"
            ></input>
            {errors?.title && (
              <p className="text-red-600 text-xs">{errors?.title?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <label className="font-bold text-zinc-800/60 tracking-wide">
              Subtitle:
            </label>
            <input
              {...register("text", { required: true })}
              id="text"
              name="text"
              placeholder="New text here"
              autoComplete="off"
              type="text"
              className="border border-transparent border-b-slate-300 focus:outline-none pl-4 text-zinc-800 font-medium"
            ></input>
            {errors?.text && (
              <p className="text-red-600 text-xs">{errors?.text?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <label className="font-bold text-zinc-800/60 tracking-wide">
              Image URL:
            </label>
            <input
              {...register("banner", { required: true })}
              id="banner"
              name="banner"
              placeholder="New image url here"
              autoComplete="off"
              type="text"
              className="border border-transparent border-b-slate-300 focus:outline-none pl-4 text-zinc-800 font-medium"
            ></input>
            {errors?.banner && (
              <p className="text-red-600 text-xs">{errors?.banner?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500  rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Modal = (props: { svg: string }) => {
  const { svg } = props;

  const [state, setState] = useState({
    isStopped: false,
    isPaused: false,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: svg === "ERRO" ? animationDataErro : animationDataOK,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-full absolute flex justify-center items-center">
      <div className="w-[300px] h-[150px] bg-white border border-slate-300 rounded-md flex flex-col justify-center items-center">
        <Lottie
          options={defaultOptions}
          height={100}
          width={100}
          isStopped={state.isStopped}
          isPaused={state.isPaused}
        />
        <span
          className={`${
            svg === "ERRO" ? "text-red-500" : "text-green-500"
          } font-bold text-xs`}
        >
          {svg === "ERRO"
            ? "Token expired, please login."
            : "Post updated with success!"}
        </span>
      </div>
    </div>
  );
};
