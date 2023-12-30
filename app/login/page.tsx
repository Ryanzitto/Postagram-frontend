"use client";
import axios from "axios";
import * as z from "zod";

import { Modal } from "app/components/General/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerSchema } from "../zodSchema/register";
import { loginSchema } from "../zodSchema/login";
import { useStore } from "app/store";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

interface Props {
  func: (newForm: string) => void;
}

type FormData = z.infer<typeof registerSchema>;

const Login = ({ func }: Props) => {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { login, saveToken } = useStore();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [status, setStatus] = useState<string | null>(null);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    setErrorMessage("");

    axios
      .post(`${URL}/auth/`, { email: data.email, password: data.password })
      .then((response) => {
        console.log(response);
        setStatus("success");
        login(response.data.user);
        saveToken(response.data.token);

        const timeout = setTimeout(() => {
          setStatus(null);
          router.push("/");
        }, 1200);
        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="w-full h-[100%] flex shadow-2xl relative">
      {status === "success" && (
        <Modal text="Logged with success" status={status} />
      )}
      <div className="w-full lg:w-1/2 rounded-md h-full lg:rounded-r-none bg-white flex flex-col items-center justify-center">
        <div className="w-full h-28 flex flex-col justify-center items-start px-2 pl-6 sm:pl-12 lg:pl-8 pt-10 gap-2">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-zinc-600/60">
              We are
            </span>
            <div className="flex">
              <span className="text-2xl sm:text-4xl font-black text-zinc-700">
                POST
              </span>
              <span className="text-2xl sm:text-4xl  font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate">
                AGRAM
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-medium text-zinc-800/80 pb-6">
            Welcome back, please login to your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[80%] border border-zinc-300 rounded-md h-fit py-6 flex flex-col items-center gap-4 mt-6"
        >
          <div className="w-[80%] flex flex-col gap-1">
            <label htmlFor="email" className="font-bold text-zinc-800 text-sm">
              Email:
            </label>
            <input
              {...register("email", { required: true })}
              id="email"
              name="email"
              placeholder="john@doe.com"
              autoComplete="off"
              className={`border border-zinc-300 rounded-md h-10 focus:outline-none pl-4 text-sm ${
                errors?.email ? "border border-red-500" : null
              }`}
            ></input>
            {errors?.email && (
              <p className="text-red-600 text-xs">{errors?.email?.message}</p>
            )}
          </div>
          <div className="w-[80%] flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-bold text-zinc-800 text-sm"
            >
              Password:
            </label>
            <input
              {...register("password", { required: true })}
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              className={`border border-zinc-300 rounded-md h-10 focus:outline-none pl-4 text-sm ${
                errors?.password ? "border border-red-500" : null
              }`}
            ></input>
            {errors?.password && (
              <p className="text-red-600 text-xs">
                {errors?.password?.message}
              </p>
            )}
          </div>
          {errorMessage !== null ? (
            <div className="w-[80%] flex justify-center items-center pt-4">
              <p className="text-red-500 text-xs font-bold">{errorMessage}</p>
            </div>
          ) : null}
          <div className="w-[80%] flex justify-center items-center pt-4">
            <motion.button
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="bg-zinc-800 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors hover:opacity-80Z"
            >
              Sign In
            </motion.button>
          </div>
          <div className="w-[80%] flex flex-col md:flex-row gap-2 justify-center items-center text-xs gap-2">
            <p className="font-medium">Don't have an account? </p>
            <a
              onClick={() => func("REGISTER")}
              className="underline cursor-pointer font-bold hover:opacity-80"
            >
              create account
            </a>
          </div>
        </form>
      </div>
      <div className="hidden lg:flex w-1/2 h-full rounded-r-md bg-zinc-800"></div>
    </div>
  );
};

const Cadastro = ({ func }: Props) => {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [status, setStatus] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: FormData) {
    if (data.file.length === 0) {
      setErroMessageFile("Selecione um arquivo para continuar!");
      return;
    }

    const isImageType = (file: File): boolean => {
      const allowedTypes = ["image/jpeg", "image/png"];
      return allowedTypes.includes(file.type);
    };

    if (data.file instanceof FileList && !isImageType(data.file[0])) {
      setErroMessageFile("Este tipo de arquivo não é aceito!");
      return;
    }

    if (data.file instanceof FileList && data.file[0].size > 5 * 1024 * 1024) {
      setErroMessageFile("O arquivo selecionado é muito grande!");
      return;
    }

    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("file", data.file[0]);

    axios
      .post(`${URL}/user/`, formData)
      .then((response) => {
        console.log(response);
        setStatus("success");
        const timeout = setTimeout(() => {
          setStatus(null);
          changeToLogin();
        }, 1200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  }

  const changeToLogin = () => {
    func("LOGIN");
  };

  const [hasFile, setHasfile] = useState<boolean>(false);

  const [fileName, setFileName] = useState<string>("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [erroMessageFile, setErroMessageFile] = useState<string>("");

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
    <>
      <div className="w-full h-fit rounded-md bg-white shadow-2xl pb-6 flex justify-center items-center flex flex-col">
        {status === "success" ? (
          <Modal text="Account created with success" status={status} />
        ) : null}
        <div className="w-full h-28 flex flex-col justify-center items-center gap-2 bg-zinc-800 rounded-t-md">
          <div className="flex flex-col">
            <span className="text-xl font-black text-white/80">We are</span>
            <span className="text-2xl font-black text-white">POSTAGRAM</span>
          </div>
          <p className="text-xs font-medium text-white/80">
            Hi, create an account to continue
          </p>
        </div>
        <div className="flex w-full justify-center items-center pt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[80%] border border-zinc-300 rounded-md h-fit p-2 lg:p-8 flex flex-col"
          >
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex flex-col lg:flex-row w-full">
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-2">
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="name"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      Name:
                    </label>
                    <input
                      {...register("name", { required: true })}
                      id="name"
                      name="name"
                      placeholder="Jhon"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.name ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.name && (
                      <p className="text-red-600 text-xs">
                        {errors?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="userName"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      UserName:
                    </label>
                    <input
                      {...register("userName", { required: true })}
                      id="userName"
                      name="userName"
                      placeholder="Johnny"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.userName ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.userName && (
                      <p className="text-red-600 text-xs">
                        {errors?.userName?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="email"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      Email:
                    </label>
                    <input
                      {...register("email", { required: true })}
                      id="email"
                      name="email"
                      placeholder="john@doe.com"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.email ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.email && (
                      <p className="text-red-600 text-xs">
                        {errors?.email?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-2">
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="password"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      Password:
                    </label>
                    <input
                      {...register("password", { required: true })}
                      id="password"
                      type="password"
                      name="password"
                      placeholder="* * * * * * * *"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.password ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.password && (
                      <p className="text-red-600 text-xs">
                        {errors?.password?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="confirmPassword"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      ConfirmPassword:
                    </label>
                    <input
                      {...register("confirmPassword", { required: true })}
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      placeholder="* * * * * * * *"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.confirmPassword ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.confirmPassword && (
                      <p className="text-red-600 text-xs">
                        {errors?.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex w-[90%] h-fit flex-col gap-2">
                    <label
                      htmlFor="file"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      Avatar:
                    </label>
                    <div
                      onChange={(e) => onChange(e)}
                      className={`relative p-4  ${
                        hasFile ? null : "border border-gray-300 bg-gray-100"
                      } rounded-md flex items-start justify-start`}
                    >
                      <input
                        {...register("file", { required: true })}
                        id="file"
                        name="file"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="absolute inset-0 h-10 opacity-0 cursor-pointer"
                      />
                      {hasFile === false && (
                        <span className="text-red-500 text-xs">
                          no file selected, click to select.
                        </span>
                      )}
                      {hasFile === true && (
                        <div className="flex gap-2 justify-start items-start">
                          {previewImage && (
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-12 h-12 rounded-full absolute object-cover border border-zinc-300"
                            />
                          )}
                          <div className="pl-14 flex flex-col justify-start items-start gap-1">
                            <span className="text-green-500 text-xs">
                              selected: {fileName}
                            </span>
                            <span className="text-zinc-600 rounded-md p-1 text-xs">
                              Click to change
                            </span>
                          </div>
                        </div>
                      )}
                      {errors?.file && (
                        <p className="text-red-600 text-xs">
                          {errors?.file?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {erroMessageFile !== "" && (
                    <p className="text-red-600 text-xs">{erroMessageFile}</p>
                  )}
                </div>
              </div>
              {errorMessage !== null ? (
                <div className="w-[80%] flex justify-center items-center pt-4">
                  <p className="text-red-500 text-xs font-bold">
                    {errorMessage}
                  </p>
                </div>
              ) : null}
              <div className="w-full flex flex-col justify-center items-center pt-6">
                <motion.button
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  className="w-[50%] h-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate text-white font-bold tracking-wide tracking-wide transition-colors"
                >
                  {isSubmitting ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 mr-2 text-white animate-spin fill-rose-600 opacity-100"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        loading...
                      </svg>
                    </div>
                  ) : (
                    "Register"
                  )}
                </motion.button>
                <div className="w-[80%] flex justify-center items-center text-xs gap-2 pt-4">
                  <p className="font-medium">have a account? </p>
                  <a
                    onClick={changeToLogin}
                    className="underline cursor-pointer font-bold hover:opacity-80"
                  >
                    log in
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function Page() {
  const [form, setForm] = useState<string>("LOGIN");
  return (
    <main className="flex w-screen min-h-screen h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate justify-center items-center">
      <div className="w-[90%] sm:w-[60%] h-[85%] flex justify-center items-center">
        {form === "LOGIN" ? (
          <Login func={setForm} />
        ) : (
          <Cadastro func={setForm} />
        )}
      </div>
    </main>
  );
}
