"use client";

import * as z from "zod";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { updatePostSchema } from "../../zodSchema/updtadePost";
import { Modal } from "../General/Modal";

type FormData = z.infer<typeof updatePostSchema>;

export default function UpdatePostProfile(userName: any) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const username = userName.userName;

  const {
    user,
    logout,
    setUpdateIsOpen,
    currentPostUpdatingId,
    fetchDataProfile,
  } = useStore();

  const [text, setText] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(updatePostSchema),
  });

  async function onSubmit(data: FormData) {
    if (data.text && data.title) {
      axios
        .patch(`${URL}/post/${currentPostUpdatingId}`, data, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((response) => {
          console.log(response);
          setShowModal(true);
          setText("Post Updated.");
          setStatus("success");
          const timeout = setTimeout(() => {
            setShowModal(false);
            setUpdateIsOpen(false);
            fetchDataProfile(username);
          }, 1200);

          return () => clearTimeout(timeout);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message === "Token has expired") {
            setShowModal(true);
            const timeout = setTimeout(() => {
              router.push("/login");
              logout();
            }, 1200);
            return () => clearTimeout(timeout);
          }
          setShowModal(true);
          setText(error.response.data.message);
          setStatus("error");
          const timeout = setTimeout(() => {
            setShowModal(false);
          }, 1200);
          return () => clearTimeout(timeout);
        });
    }
  }

  return (
    <div className="z-20 fixed flex justify-center items-center w-full h-screen bg-zinc-800/60 -mt-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.8,
        }}
        transition={{
          duration: 0.2,
          delay: 0,
        }}
        className="w-[500px] h-fit bg-white rounded-md p-4 flex justify-start items-center flex-col relative"
      >
        {showModal === true && <Modal text={text} status={status} />}
        <div className="w-full absolute h-10 flex justify-end pr-4 flex just">
          <button
            onClick={() => setUpdateIsOpen(false)}
            className="p-4 rounded-md  transition-colors bg-zinc-200 font-bold flex justify-center items-center text-zinc-800/50 hover:bg-red-500 hover:text-white"
          >
            X
          </button>
        </div>
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex ">
          <img
            className="rounded-full object-cover"
            src={`${URL}/${user?.avatar.src}`}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] h-fit p-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-zinc-800/60 tracking-wide">
              New Title:
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
              New Subtitle:
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
          <div className="flex flex-col gap-2 pt-8">
            <motion.button
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate  rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors"
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
