"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "../zodSchema/login";

import axios from "axios";

type FormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    console.log(isSubmitting);
    console.log(data);

    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/auth/`, { email: data.email, password: data.password })
      .then((response) => {
        console.log(response);
        router.push("/");
      })
      .catch((error) => console.log(error));
  }
  return (
    <>
      <div className="w-1/2 h-full rounded-l-md bg-white flex flex-col items-center">
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
              className="border border-zinc-300 rounded-md h-8 focus:outline-none"
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
              className="border border-zinc-300 rounded-md h-8 focus:outline-none"
            ></input>
            {errors?.password && (
              <p className="text-red-600 text-xs">
                {errors?.password?.message}
              </p>
            )}
          </div>
          <div className="w-[80%] flex justify-center items-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500  rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors hover:opacity-80"
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
            <a className="underline cursor-pointer font-bold hover:opacity-80">
              create account
            </a>
          </div>
        </form>
      </div>
      <div className="w-1/2 h-full rounded-r-md bg-zinc-800"></div>
    </>
  );
};

const Cadastro = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    console.log(isSubmitting);
    console.log(data);

    const baseUrl = "http://localhost:3000";

    axios
      .post(`${baseUrl}/auth/`, { email: data.email, password: data.password })
      .then((response) => {
        console.log(response);
        router.push("/");
      })
      .catch((error) => console.log(error));
  }
  return (
    <>
      <div className="w-full h-full rounded-md bg-white">
        <div className="w-full h-28 flex flex-col justify-center items-center gap-2">
          <div className="flex gap-2">
            <span className="text-4xl font-black text-zinc-600/90">We are</span>
            <span className="text-4xl font-black text-zinc-800">App</span>
          </div>
          <p className="text-sm font-medium text-zinc-800/80">
            Hi, create an account to continue
          </p>
        </div>
        <div className="flex w-full justify-center items-center pt-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[60%] border border-zinc-300 rounded-md h-fit p-4 flex flex flex-col"
          >
            <div className="w-full flex">
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <div className="w-[60%] flex flex-col gap-1 ">
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
                    className="border border-zinc-300 rounded-md h-8 focus:outline-none text-xs"
                  ></input>
                  {errors?.email && (
                    <p className="text-red-600 text-xs">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="w-[60%] flex flex-col gap-1 ">
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
                    className="border border-zinc-300 rounded-md h-8 focus:outline-none text-xs"
                  ></input>
                  {errors?.email && (
                    <p className="text-red-600 text-xs">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="w-[60%] flex flex-col gap-1 ">
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
                    className="border border-zinc-300 rounded-md h-8 focus:outline-none text-xs"
                  ></input>
                  {errors?.email && (
                    <p className="text-red-600 text-xs">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="w-[60%] flex flex-col gap-1 ">
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
                    className="border border-zinc-300 rounded-md h-8 focus:outline-none text-xs"
                  ></input>
                  {errors?.email && (
                    <p className="text-red-600 text-xs">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div className="w-[60%] flex flex-col gap-1 ">
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
                    className="border border-zinc-300 rounded-md h-8 focus:outline-none text-xs"
                  ></input>
                  {errors?.email && (
                    <p className="text-red-600 text-xs">
                      {errors?.email?.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-md h-10 text-white font-bold tracking-wide tracking-wide transition-colors hover:opacity-80"
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function Page() {
  return (
    <main className="flex w-screen min-h-screen h-screen bg-gradient-to-r from-purple-500 to-pink-500 justify-center items-center">
      <div className="w-[60%] h-[85%] flex justify-center items-center shadow-2xl">
        {/* <Login /> */}
        <Cadastro />
      </div>
    </main>
  );
}
