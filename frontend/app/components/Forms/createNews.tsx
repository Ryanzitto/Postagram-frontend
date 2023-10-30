"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Lottie from "react-lottie";

import * as z from "zod";

import animationDataOK from "../../../public/Animation-OK.json";
import animationDataErro from "../../../public/Animation-ERRO.json";
import { createPostSchema } from "../../zodSchema/createPost";

type FormData = z.infer<typeof createPostSchema>;

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
            : "Post created with success!"}
        </span>
      </div>
    </div>
  );
};

export default function CreateNews() {
  const { user, logout, fetchData, setCreateIsOpen, createIsOpen } = useStore();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [svg, setSvg] = useState<string>("ERRO");

  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  async function onSubmit(data: FormData) {
    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/news/`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setSvg("SUCCESS");
        setShowModal(true);
        const timeout = setTimeout(() => {
          setShowModal(false);
          setCreateIsOpen(false);
          fetchData();
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
          setSvg("ERRO");
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
    <div className="z-20 fixed flex justify-center items-center w-full h-screen bg-zinc-800/60">
      <div className="w-[500px] h-fit bg-white rounded-md p-4 flex justify-start items-center flex-col relative">
        {showModal && <Modal svg={svg} />}
        <div className="w-full absolute h-10 flex justify-end pr-4 flex just">
          <button
            onClick={() => setCreateIsOpen(false)}
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
              placeholder="Post title here"
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
              placeholder="Post text here"
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
              placeholder="Post image"
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
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}