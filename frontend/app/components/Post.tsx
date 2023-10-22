import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import * as z from "zod";

import { createCommentSchema } from "../zodSchema/createComment";

type FormData = z.infer<typeof createCommentSchema>;

interface DateFormatOptions {
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
}

interface Post {
  post: {
    banner: string;
    comments: Array<any>;
    id: string;
    likes: Array<any>;
    text: string;
    title: string;
    userName: string;
    avatar: string;
    createdAt: string;
  };
}

export const Post = ({ post }: Post) => {
  const { user, fetchData } = useStore();

  const [load, setLoad] = useState<boolean>(false);

  const [showAllComments, setShowAllComments] = useState<boolean>(false);

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

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createCommentSchema),
  });

  async function onSubmit(data: FormData) {
    const baseUrl = "http://localhost:3000";

    axios
      .patch(
        `${baseUrl}/news/comment/${post.id}`,
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
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("teste");
  }

  useEffect(() => {
    setLoad(true);
  }, []);

  return (
    <div className="w-full h-fit rounded-md flex items-center flex-col hover:bg-zinc-200/30 py-6 text-zinc-800">
      {load === true && (
        <>
          <div className="w-[90%] h-20 flex justify-start items-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex justify-center items-center">
              <div
                className="rounded-full w-[90%] h-[90%]"
                style={{
                  backgroundImage: `url(${post.avatar})`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>

            <div className="flex flex-col items-start h-full pt-2 pl-2">
              <span className="text-lg font-bold hover:opacity-80">
                <Link href={`/perfil/${post?.userName}`}>{post?.userName}</Link>
              </span>
              <span className="text-xs">{dateFormated(post?.createdAt)}</span>
            </div>
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
          <div className="w-[90%] flex justify-end items-center gap-2 h-16 pr-2 py-1">
            <img
              className="cursor-pointer h-6 w-6"
              src="https://cdn-icons-png.flaticon.com/128/2589/2589197.png"
            />
          </div>
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-[90%] flex flex-col"
            >
              <div className="flex gap-4">
                <input
                  {...register("comment", { required: true })}
                  id="comment"
                  name="comment"
                  autoComplete="off"
                  placeholder="type a comment"
                  className="border border-slate-300 h-10 pl-6 focus:outline-none w-full rounded-md"
                ></input>
                <button
                  type="submit"
                  className="px-4 text-xl rounded-md transition-colors bg-zinc-200 font-bold flex justify-center items-center text-zinc-800/50 hover:bg-green-500 hover:text-white"
                >
                  <img
                    className="w-6 h-6"
                    src="https://cdn-icons-png.flaticon.com/128/5859/5859253.png"
                  />
                </button>
              </div>
              {errors?.comment && (
                <p className="text-red-600 text-xs pt-2">
                  {errors?.comment?.message}
                </p>
              )}
            </form>
          </div>
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
      )}
    </div>
  );
};
