"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "app/zodSchema/login";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "app/store";
import { toast } from "sonner";

type FormData = z.infer<typeof loginSchema>;

export default function SignUp() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;
  const { user, setUser, setLoginRemember, loginRemember } = useStore();

  const router = useRouter();

  const [isChecked, setIsChecked] = useState(loginRemember.isChecked);

  const [emailIsHovered, setEmailIsHovered] = useState<boolean>(false);
  const [passwordIsHovered, setPasswordIsHovered] = useState<boolean>(false);

  const [inputEmailContent, setInputEmailContent] = useState<string>(
    loginRemember.email
  );
  const [inputPasswordContent, setInputPasswordContent] = useState<string>(
    loginRemember.password
  );

  const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigateToSignUp = () => {
    router.push("/auth/signUp");
  };
  const navigateHome = () => {
    router.push("/");
  };

  async function onSubmit() {
    const formatedDate = {
      email: inputEmailContent,
      password: inputPasswordContent,
      isChecked: isChecked,
    };
    axios
      .post(`${URL}/auth/`, formatedDate)
      .then((response) => {
        if (isChecked) {
          setLoginRemember(formatedDate);
        }
        const loggedUser = response.data.user;
        loggedUser.token = response.data.token;
        setUser(loggedUser);
        toast.success("successfully logged in");
        setErrorMessage(null);
        navigateHome();
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
      });
  }

  const teste = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    console.log(loginRemember);
  }, [loginRemember]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-zinc-800">
      <div className="bg-white rounded-lg w-[90%] sm:w-[500px] h-fit max-h-[90%] flex flex-col py-8 justify-center items-center">
        <span className="text-zinc-800/60 font-bold text-xs sm:text-sm">
          Welcome back,
        </span>
        <span className="text-zinc-800/60 font-bold text-xs sm:text-sm">
          Please login to continue to PostApp.
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[70%] h-fit pt-10 py-4 gap-6 flex flex-col"
        >
          <div className="flex flex-col w-full gap-1">
            <label className="text-zinc-600 text-sm">Email:</label>
            <input
              onMouseEnter={() => setEmailIsHovered(true)}
              onMouseLeave={() => setEmailIsHovered(false)}
              {...register("email", { required: true })}
              id="email"
              name="email"
              value={inputEmailContent}
              onChange={(e) => setInputEmailContent(e.target.value)}
              placeholder="Your email here"
              type="text"
              className="text-sm sm:text-md  mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
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
            <label className="text-zinc-600 text-sm">Password:</label>
            <div className="flex items-center gap-2 w-full pr-4">
              <input
                onMouseEnter={() => setPasswordIsHovered(true)}
                onMouseLeave={() => setPasswordIsHovered(false)}
                {...register("password", { required: true })}
                id="password"
                name="password"
                value={inputPasswordContent}
                onChange={(e) => setInputPasswordContent(e.target.value)}
                placeholder="Your password here"
                type={shouldShowPassword ? "text" : "password"}
                className="text-sm sm:text-md  mt-1 bg-transparent w-full outline-none text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50"
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
          <div onChange={teste} className="w-full flex  gap-2 items-center">
            <input checked={isChecked} type="checkbox" />
            <span className="text-xs text-zinc-600">Remember me</span>
          </div>
          <button
            type="submit"
            className="bg-purple-500 rounded-lg flex justify-center items-center w-full p-2 text-white font-bold hover:bg-purple-600"
          >
            Login
          </button>
        </form>
        {errorMessage !== null && (
          <div className="w-full flex justify-center items-center pt-2">
            <span className="text-red-500 text-xs">{errorMessage}</span>
          </div>
        )}
        <div className="w-full flex justify-center items-center pt-6">
          <span className="text-zinc-600/80 text-sm">
            Dont have an account?{" "}
            <strong
              onClick={navigateToSignUp}
              className="cursor-pointer hover:underline"
            >
              Sign Up
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
