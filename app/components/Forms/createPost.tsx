"use client";

import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { createPostSchema } from "../../zodSchema/createPost";

import { Modal } from "../General/Modal";

import { FileIcon } from "public/icons/fileIcon";

type FormData = z.infer<typeof createPostSchema>;

export default function CreatePost() {
  const { setCreateIsOpen, user, fetchData, logout } = useStore();

  const [erroMessageFile, setErroMessageFile] = useState<string>("");

  const [text, setText] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean | null>(null);

  const [hasFile, setHasfile] = useState<boolean>(false);

  const [fileName, setFileName] = useState<string>("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    if (data.file.length === 0) {
      setErroMessageFile("Selecione um arquivo para continuar!");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("file", data.file[0]);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const baseUrl = "https://postagram-p8hh.onrender.com";

    axios
      .post(`${baseUrl}/post/`, formData, config)

      .then((response) => {
        console.log(response);
        setShowModal(true);
        setText("Post created.");
        setStatus("success");
        const timeout = setTimeout(() => {
          setCreateIsOpen(false);
          setShowModal(false);
          fetchData("https://postagram-p8hh.onrender.com/post");
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        setShowModal(true);
        setText("Error.");
        setStatus("error");
        if (error.response.data.message === "Token has expired") {
          const timeout = setTimeout(() => {
            router.push("/login");
            logout();
          }, 1200);
          return () => clearTimeout(timeout);
        }
      });
  }

  const onChange = (e: any) => {
    if (e.target.files[0]) {
      setHasfile(true);
      setFileName(e.target.files[0].name);
      setErroMessageFile("");

      // Cria uma URL de dados para a imagem selecionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="z-20 fixed flex justify-center items-center w-full h-screen bg-zinc-800/60">
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
            onClick={() => setCreateIsOpen(false)}
            className="p-4 rounded-md  transition-colors bg-zinc-200 font-bold flex justify-center items-center text-zinc-800/50 hover:bg-red-500 hover:text-white"
          >
            X
          </button>
        </div>

        <div className="w-16 h-16 rounded-full bg-zinc-800 flex ">
          <img
            className="rounded-full object-cover"
            src={`https://postagram-p8hh.onrender.com/${user.avatar.src}`}
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] h-fit p-4 flex flex-col"
        >
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
            <label
              htmlFor={"file"}
              className="font-bold text-zinc-800/60 tracking-wide"
            >
              Image:
            </label>
            <div
              onChange={(e: any) => onChange(e)}
              className="relative p-4 border border-gray-300 bg-gray-100 rounded-md flex items-center justify-center"
            >
              <input
                {...register("file", { required: true })}
                id="file"
                name="file"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {hasFile === false && (
                <span className="text-gray-500">Escolher arquivo</span>
              )}
              {hasFile === true && (
                <div className="flex flex-col gap-4 justify-center items-center">
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-32 rounded-md border border-zinc-300"
                    />
                  )}
                  <div className="flex gap-2 justify-center items-center">
                    <FileIcon />
                    <span className="text-gray-500">{fileName}</span>
                  </div>
                </div>
              )}
              {errors?.file && (
                <p className="text-red-600 text-xs">{errors?.file?.message}</p>
              )}
            </div>
            {erroMessageFile !== "" && (
              <p className="text-red-600 text-xs">{erroMessageFile}</p>
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
      </motion.div>
    </div>
  );
}
