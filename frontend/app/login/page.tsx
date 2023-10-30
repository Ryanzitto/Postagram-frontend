"use client";

import axios from "axios";
import Lottie from "react-lottie";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerSchema } from "../zodSchema/register";
import { loginSchema } from "../zodSchema/login";
import { useStore } from "app/store";

import animationData from "../../public/Animation-OK.json";

interface Props {
  func: (newForm: string) => void;
}

type FormData = z.infer<typeof registerSchema>;

const Modal = (props: { text: string; color: string }) => {
  const { text, color } = props;
  const [state, setState] = useState({
    isStopped: false,
    isPaused: false,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
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
        <span className={`${color} font-bold text-xs`}>{text}</span>
      </div>
    </div>
  );
};

const Login = ({ func }: Props) => {
  const { user, login, saveToken, logout } = useStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/auth/`, { email: data.email, password: data.password })
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
        setErrorMessage(error.response.data.message);
      });
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="w-full h-[100%] flex shadow-2xl relative">
      {status === "success" ? (
        <Modal text="Logged with success" color="text-green-500" />
      ) : null}
      <div className="w-1/2 h-full rounded-l-md bg-white pb-8 flex flex-col items-center">
        <div className="w-full h-16 flex justify-start items-center pl-10">
          <span className="text-3xl font-black text-zinc-800">A</span>
        </div>
        <div className="w-full h-28 flex flex-col justify-center items-start pl-10 gap-2">
          <div className="flex gap-2">
            <span className="text-4xl font-black text-zinc-600/90">We are</span>
            <span className="text-4xl font-black text-zinc-800">App</span>
          </div>
          <p className="text-sm font-medium text-zinc-800/80">
            Welcome back, please login to your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[80%] border border-zinc-300 rounded-md h-fit py-8 flex flex-col items-center gap-4"
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500  rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors"
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
                "Sign In"
              )}
            </button>
          </div>
          <div className="w-[80%] flex justify-center items-center text-xs gap-2">
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
      <div className="w-1/2 h-full rounded-r-md bg-zinc-800"></div>
    </div>
  );
};

const Cadastro = ({ func }: Props) => {
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
    setErrorMessage(null);

    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/user/`, {
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: data.password,
        avatar: data.avatar,
      })
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

  return (
    <>
      <div className="w-full h-fit rounded-md bg-white shadow-2xl pb-6 flex justify-center items-center flex flex-col">
        {status === "success" ? (
          <Modal text="Logged with success " color="text-green-500" />
        ) : null}
        <div className="w-full h-28 flex flex-col justify-center items-center gap-2 bg-zinc-800 rounded-t-md">
          <div className="flex gap-2">
            <span className="text-4xl font-black text-white/80">We are</span>
            <span className="text-4xl font-black text-white">App</span>
          </div>
          <p className="text-sm font-medium text-white/80">
            Hi, create an account to continue
          </p>
        </div>
        <div className="flex w-full justify-center items-center pt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[80%] border border-zinc-300 rounded-md h-fit p-8 flex flex flex-col"
          >
            <div className="w-full flex flex-col justify-center items-center">
              <div className="flex w-full">
                <div className="w-1/2 flex flex-col items-center justify-center gap-2">
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
                <div className="w-1/2 flex flex-col items-center justify-center gap-2">
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
                  <div className="w-[90%] flex flex-col gap-1 ">
                    <label
                      htmlFor="avatar"
                      className="font-bold text-zinc-800 text-xs"
                    >
                      Avatar URL:
                    </label>
                    <input
                      {...register("avatar", { required: true })}
                      id="avatar"
                      name="avatar"
                      placeholder="https://imagem.com"
                      autoComplete="off"
                      className={`border border-zinc-300 rounded-md h-10 focus:outline-none text-sm pl-2 ${
                        errors.avatar ? "border border-red-500" : null
                      }`}
                    ></input>
                    {errors?.avatar && (
                      <p className="text-red-600 text-xs">
                        {errors?.avatar?.message}
                      </p>
                    )}
                  </div>
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[50%] bg-gradient-to-r from-purple-500 to-pink-500  rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors hover:opacity-80"
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
                </button>
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
    <main className="flex w-screen min-h-screen h-screen bg-gradient-to-r from-purple-500 to-pink-500 justify-center items-center">
      <div className="w-[60%] h-[85%] flex justify-center items-center">
        {form === "LOGIN" ? (
          <Login func={setForm} />
        ) : (
          <Cadastro func={setForm} />
        )}
      </div>
    </main>
  );
}
