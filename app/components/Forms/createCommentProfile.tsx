"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useStore } from "app/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { createCommentSchema } from "../../zodSchema/createComment";
import { Modal } from "../General/Modal";

type FormData = z.infer<typeof createCommentSchema>;

interface Props {
  post: {
    banner: { src: string; _id: string };
    comments: Array<any>;
    _id: string;
    likes: Array<any>;
    text: string;
    title: string;
    createdAt: string;
    __v: number;
    user: {
      avatar: {
        src: string;
        _id: string;
      };
      bio?: string;
      email: string;
      name: string;
      userName: string;
      _id: string;
      __v: number;
    };
  };
}

export default function CreateCommentProfile({ post }: Props) {
  const { user, fetchDataProfile, logout } = useStore();

  const [inputText, setInputText] = useState<string | null>(null);

  const [text, setText] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createCommentSchema),
  });

  async function onSubmit(data: FormData) {
    axios
      .patch(
        `${URL}/post/comment/${post._id}`,
        {
          comment: data.comment,
          userName: user?.userName,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setShowModal(true);
        setText("Comment created.");
        setStatus("success");
        const timeout = setTimeout(() => {
          setShowModal(false);
          fetchDataProfile(user?.userName);
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        setShowModal(true);
        setText("Error.");
        setStatus("error");
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
    <div className="w-[90%] h-fit flex justify-center gap-2 pr-2 py-1">
      <div className="absolute w-full">
        {showModal === true && <Modal text={text} status={status} />}
      </div>
      <div className="w-[20%] sm:[10%] sm:max-h-[10%] flex justify-center items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center">
          <img
            className="rounded-full w-full h-full object-cover"
            src={user?.avatar?.src}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] flex flex-col">
        <div
          onChange={(e: any) => setInputText(e.target.value)}
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
}
