"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { createPostSchema } from "../../zodSchema/createPost";
import { FileIcon } from "public/icons/fileIcon";

import { useDropzone } from "react-dropzone";
import { CloseIcon } from "public/icons/closeIcon";
import { UploadIcon } from "public/icons/uploadIcon";

type FormData = z.infer<typeof createPostSchema>;

export default function CreateNews() {
  const { setCreateIsOpen, user, fetchData, logout } = useStore();

  const [erroMessageFile, setErroMessageFile] = useState<string>("");

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

    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/news/`, formData, config)

      .then((response) => {
        console.log(response);
        const timeout = setTimeout(() => {
          setCreateIsOpen(false);
          fetchData("http://localhost:3000/news");
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Token has expired") {
          const timeout = setTimeout(() => {
            router.push("/login");
            logout();
          }, 1200);
          return () => clearTimeout(timeout);
        }
      });
  }

  // const removeFile = useCallback(() => {
  //   setFile(null);
  // }, [file]);

  // const onDrop = useCallback((files: FileList[]) => {
  //   console.log("entrou aqui");
  //   setFile(files[0]);
  // }, []);

  // useEffect(() => {
  //   if (file) {
  //     console.log(file);
  //   }
  // });

  // const dropzone = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/jpeg": [".jpeg"],
  //     "image/png": [".png"],
  //   },
  // });

  return (
    <div className="z-20 fixed flex justify-center items-center w-full h-screen bg-zinc-800/60">
      <div className="w-[500px] h-fit bg-white rounded-md p-4 flex justify-start items-center flex-col relative">
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
          {/* <div className="w-full flex justify-center items-center">
            {file ? (
              <div className="w-[95%] h-[200px] rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 flex justify-center items-center">
                <div className="bg-white w-fit p-2 rounded-md shadow-md flex gap-3 items-center justify-center">
                  <FileIcon />
                  <span className="text-sm text-gray-500 my-4">
                    {file?.name}
                  </span>
                  <button
                    onClick={removeFile}
                    type="button"
                    className=" mt-1 p-1"
                  >
                    <CloseIcon className="hover:text-red-400 transition-colors" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...dropzone.getRootProps()}
                className={`w-[95%] bg-gray-700 h-[200px] rounded-lg border-dashed border-4 hover:border-gray-500 hover:bg-gray-600 transition-all ${
                  dropzone.isDragActive ? "border-blue-500" : "border-gray-600"
                }`}
              >
                <label
                  htmlFor="dropzone-file"
                  className="cursor-pointer w-full h-full"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
                    <UploadIcon
                      className={`w-10 h-10 mb-3 ${
                        dropzone.isDragActive
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    />
                    {dropzone.isDragActive ? (
                      <p className="font-bold text-lg text-blue-400">
                        Solte para adcionar
                      </p>
                    ) : (
                      <>
                        <p className="text-md text-gray-500 mb-2">
                          <span className="font-bold">CLIQUE PARA ENVIAR</span>{" "}
                          ou arraste até aqui.
                        </p>
                        <p className="text-gray-300 text-sm">PNG/JPG</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  {...register("file", { required: true })}
                  {...dropzone.getInputProps()}
                  id="file"
                  name="file"
                  type="file"
                  accept="image/png, image/jpeg" />

                {errors?.file && (
                  <p className="text-red-600 text-xs">
                    {errors?.file?.message}
                  </p>
                )}
              </div>
            )}
          </div> */}
          <div
            className="flex flex-col gap-2"
            onChange={() => setErroMessageFile("")}
          >
            <label
              htmlFor={"file"}
              className="font-bold text-zinc-800/60 tracking-wide"
            >
              File:
            </label>
            <input
              {...register("file", { required: true })}
              id="file"
              name="file"
              type="file"
              className="border border-transparent border-b-slate-300 focus:outline-none pl-4 text-zinc-800 font-medium"
            />
            {errors?.file && (
              <p className="text-red-600 text-xs">{errors?.file?.message}</p>
            )}
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
      </div>
    </div>
  );
}
