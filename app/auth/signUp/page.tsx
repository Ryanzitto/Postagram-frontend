"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "app/zodSchema/register";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

type FormData = z.infer<typeof registerSchema>;

export default function SignUp() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;
  const router = useRouter();
  const [nameIsHovered, setNameIsHovered] = useState<boolean>(false);
  const [userNameIsHovered, setUserNameIsHovered] = useState<boolean>(false);
  const [emailIsHovered, setEmailIsHovered] = useState<boolean>(false);
  const [passwordIsHovered, setPasswordIsHovered] = useState<boolean>(false);
  const [confirmPasswordIsHovered, setConfirmPasswordIsHovered] =
    useState<boolean>(false);

  const [inputNameContent, setInputNameContent] = useState<string>("");
  const [inputUserNameContent, setInputUserNameContent] = useState<string>("");
  const [inputEmailContent, setInputEmailContent] = useState<string>("");
  const [inputPasswordContent, setInputPasswordContent] = useState<string>("");
  const [inputConfirmPasswordContent, setInputConfirmPasswordContent] =
    useState<string>("");

  const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
  const [shouldShowConfirmPassword, setShouldShowConfirmPassword] =
    useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigateToSignIn = () => {
    router.push("/auth/signIn");
  };

  async function onSubmit(data: FormData) {
    console.log(data);
    axios
      .post(`${URL}/user/`, data)
      .then((response) => {
        console.log(response);
        toast.success("An account has created.");
        setErrorMessage(null);
        navigateToSignIn();
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-zinc-800">
      <div className="bg-white rounded-lg w-[90%] max-w-[500px] h-fit flex flex-col py-6 md:py-8 justify-center items-center">
        <span className="text-zinc-800/60 font-bold text-md md:text-sm text-center antialiased">
          Create an account <br />
          on{" "}
          <strong className="font-black tracking-wider text-purple-500">
            POSTAPP
          </strong>
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[70%] h-fit pt-10 py-4 gap-6 flex flex-col"
        >
          <input
            {...register("avatar", { required: true })}
            id="avatar"
            name="avatar"
            type="text"
            value={"cat-1.png"}
            className="hidden"
          />
          <div
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputNameContent(e.target.value)
            }
            className="flex flex-col w-full gap-1"
          >
            <input
              onMouseEnter={() => setNameIsHovered(true)}
              onMouseLeave={() => setNameIsHovered(false)}
              {...register("name", { required: true })}
              id="name"
              name="name"
              placeholder="Your name here"
              type="text"
              value={inputNameContent}
              className="text-sm sm:text-md mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
            />
            <div className="w-full h-[2px] flex bg-slate-200">
              <div
                className={`${
                  nameIsHovered || inputNameContent !== "" ? "w-full" : "w-0"
                } transition-all h-full bg-zinc-600`}
              ></div>
            </div>
            {errors?.name && (
              <p className="text-red-600 text-xs pt-1">
                {errors?.name?.message}
              </p>
            )}
          </div>
          <div
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputUserNameContent(e.target.value)
            }
            className="flex flex-col w-full gap-1"
          >
            <input
              onMouseEnter={() => setUserNameIsHovered(true)}
              onMouseLeave={() => setUserNameIsHovered(false)}
              {...register("userName", { required: true })}
              id="userName"
              name="userName"
              placeholder="Your username here"
              type="text"
              value={inputUserNameContent}
              className="text-sm sm:text-md mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
            />
            <div className="w-full h-[2px] flex bg-slate-200">
              <div
                className={`${
                  userNameIsHovered || inputUserNameContent !== ""
                    ? "w-full"
                    : "w-0"
                }  transition-all h-full bg-zinc-600`}
              ></div>
            </div>
            {errors?.userName && (
              <p className="text-red-600 text-xs pt-1">
                {errors?.userName?.message}
              </p>
            )}
          </div>
          <div
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputEmailContent(e.target.value)
            }
            className="flex flex-col w-full gap-1"
          >
            <input
              onMouseEnter={() => setEmailIsHovered(true)}
              onMouseLeave={() => setEmailIsHovered(false)}
              {...register("email", { required: true })}
              id="email"
              name="email"
              value={inputEmailContent}
              placeholder="Your email here"
              type="text"
              className="text-sm sm:text-md mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
            />
            <div className="w-full h-[2px] flex bg-slate-200">
              <div
                className={`${
                  emailIsHovered || inputEmailContent !== "" ? "w-full" : "w-0"
                }  transition-all h-full bg-zinc-600`}
              ></div>
            </div>
            {errors?.email && (
              <p className="text-red-600 text-xs pt-1">
                {errors?.email?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <div
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputPasswordContent(e.target.value)
              }
              className="flex items-center gap-2 w-full pr-4"
            >
              <input
                onMouseEnter={() => setPasswordIsHovered(true)}
                onMouseLeave={() => setPasswordIsHovered(false)}
                {...register("password", { required: true })}
                id="password"
                name="password"
                value={inputPasswordContent}
                placeholder="Your password here"
                type={shouldShowPassword ? "text" : "password"}
                className="text-sm sm:text-md mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
              />
              {shouldShowPassword ? (
                <Eye
                  onClick={() => setShouldShowPassword(false)}
                  className="cursor-pointer w-5 text-zinc-600/60"
                />
              ) : (
                <EyeOff
                  onClick={() => setShouldShowPassword(true)}
                  className="cursor-pointer w-5 text-zinc-600/60"
                />
              )}
            </div>

            <div className="w-full h-[2px] flex bg-slate-200">
              <div
                className={`${
                  passwordIsHovered || inputPasswordContent !== ""
                    ? "w-full"
                    : "w-0"
                } transition-all h-full bg-zinc-600`}
              ></div>
            </div>
            {errors?.password && (
              <p className="text-red-600 text-xs pt-1">
                {errors?.password?.message}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-1">
            <div
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputConfirmPasswordContent(e.target.value)
              }
              className="flex items-center gap-2 w-full pr-4"
            >
              <input
                onMouseEnter={() => setConfirmPasswordIsHovered(true)}
                onMouseLeave={() => setConfirmPasswordIsHovered(false)}
                {...register("confirmPassword", { required: true })}
                id="confirmPassword"
                name="confirmPassword"
                value={inputConfirmPasswordContent}
                placeholder="Confirm your password"
                type={shouldShowConfirmPassword ? "text" : "password"}
                className="text-sm sm:text-md mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
              />
              {shouldShowConfirmPassword ? (
                <Eye
                  onClick={() => setShouldShowConfirmPassword(false)}
                  className="cursor-pointer w-5 text-zinc-600/60"
                />
              ) : (
                <EyeOff
                  onClick={() => setShouldShowConfirmPassword(true)}
                  className="cursor-pointer w-5 text-zinc-600/60"
                />
              )}
            </div>

            <div className="w-full h-[2px] flex bg-slate-200">
              <div
                className={`${
                  confirmPasswordIsHovered || inputConfirmPasswordContent !== ""
                    ? "w-full"
                    : "w-0"
                }  transition-all h-full bg-zinc-600`}
              ></div>
            </div>
            {errors?.confirmPassword && (
              <p className="text-red-600 text-xs pt-1">
                {errors?.confirmPassword?.message}
              </p>
            )}
          </div>
          <div className="flex w-full justify-center items-center">
            <button
              type="submit"
              className="bg-purple-500 rounded-lg flex justify-center items-center w-full p-2 text-white font-bold hover:bg-purple-600"
            >
              <span>Create an account</span>
            </button>
          </div>
        </form>
        {errorMessage !== null && (
          <div className="w-full flex justify-center items-center pt-2">
            <span className="text-red-500 text-xs">{errorMessage}</span>
          </div>
        )}
        <div className="w-full flex justify-center items-center pt-6">
          <span className="text-zinc-600/80 text-sm">
            Already have an account?{" "}
            <strong
              onClick={navigateToSignIn}
              className="cursor-pointer hover:underline"
            >
              Log In
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
