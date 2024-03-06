import React, { ReactNode, useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useStore } from "app/store";
import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "app/zodSchema/EditProfile";

type FormData = z.infer<typeof editProfileSchema>;
interface Props {
  children: ReactNode;
}

const avatarPath = [
  "cat-1.png",
  "cat-2.png",
  "cat-3.png",
  "cat-4.png",
  "cat-5.png",
  "cat-6.png",
  "cat-7.png",
  "cat-8.png",
  "cat-9.png",
  "cat-10.png",
  "cat-11.png",
  "cat-12.png",
  "cat-13.png",
];

export default function EditDialog({ children }: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const router = useRouter();

  const [nameIsHovered, setNameIsHovered] = useState<boolean>(false);

  const [inputNameContent, setInputNameContent] = useState<string>("");

  const [selectedAvatar, setSelectedAvatar] = useState<string>("cat-1.png");

  const [shouldShowAvatarSelector, setShouldShowAvatarSelector] =
    useState<boolean>(false);
  const [avatarIsHovered, setAvatarIsHovered] = useState<boolean>(false);
  const { logout, user } = useStore();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
  });

  async function onSubmit(data: FormData) {}
  const handleClickDelete = () => {
    // axios
    //   .delete(`${URL}/post/${postID}`, {
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     toast.success("Post successfully deleted.");
    //     setPostDeleted(true);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error("An unexpected error occurred");
    //   });
  };

  const handleClickSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
    setShouldShowAvatarSelector(false);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
          <AlertDialog.Content className="w-[300px] sm:w-[500px] flex flex-col items-center h-fit p-6 bg-zinc-800 border border-zinc-700 rounded-lg">
            <AlertDialog.Title className="text-white text-sm sm:text-md font-bold">
              Make changes to your profile here. Click save when you're done.
            </AlertDialog.Title>
            <AlertDialog.Description className="text-white/50 text-xs sm:text-sm pt-2">
              The changes will be aplied to your profile.
            </AlertDialog.Description>
            <form className="w-full flex flex-col rounded-md gap-4 p-6 relative">
              <div className="flex flex-col w-full gap-1">
                <label className="text-white text-xs">UserName</label>
                <input
                  onMouseEnter={() => setNameIsHovered(true)}
                  onMouseLeave={() => setNameIsHovered(false)}
                  {...register("userName", { required: false })}
                  id="userName"
                  name="userName"
                  placeholder="New userName here..."
                  type="text"
                  value={inputNameContent}
                  onChange={(e) => setInputNameContent(e.target.value)}
                  className="text-sm sm:text-md mt-2 bg-transparent w-full outline-none text-white/80 font-semibold placeholder:font-light placeholder:text-white/50"
                />
                <div className="w-full h-[2px] flex bg-white/20">
                  <div
                    className={`${
                      nameIsHovered || inputNameContent !== ""
                        ? "w-full"
                        : "w-0"
                    } transition-all h-full bg-purple-600`}
                  ></div>
                </div>
                {errors?.userName && (
                  <p className="text-red-600 text-xs pt-1">
                    {errors?.userName?.message}
                  </p>
                )}
              </div>
              <div className="flex w-full gap-1">
                <div className="flex flex-col w-[80%]">
                  <label className="text-white text-xs">Bio</label>
                  <textarea
                    {...register("bio", { required: false })}
                    id="bio"
                    name="bio"
                    placeholder="Your new Bio here..."
                    className={`focus:border-purple-500 text-sm sm:text-md mt-2 bg-transparent w-full outline-none border border-zinc-500/80 rounded-md pl-6 pt-2 text-zinc-600/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50`}
                  />
                  {errors?.userName && (
                    <p className="text-red-600 text-xs pt-1">
                      {errors?.userName?.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-[20%] gap-1 justify-center items-center">
                  <label className="text-white text-xs">Avatar</label>
                  <div
                    onMouseOver={() => setAvatarIsHovered(true)}
                    onMouseLeave={() => setAvatarIsHovered(false)}
                    onClick={() => setShouldShowAvatarSelector(true)}
                    className="cursor-pointer w-fit h-fit flex flex-col justify-center items-center rounded-lg p-1 bg-zinc-700/80 transition-all hover:bg-purple-500"
                  >
                    <img
                      className="w-12 h-12"
                      src={`/images/${selectedAvatar}`}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
              >
                <AlertDialog.Cancel asChild>
                  <button className="outline-none bg-zinc-300 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-zinc-600 font-semibold mt-6 transition-all">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={handleClickDelete}
                    className="outline-none bg-purple-500 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-white font-semibold mt-6 transition-all hover:bg-purple-600"
                  >
                    Save
                  </button>
                </AlertDialog.Action>
              </div>
              {shouldShowAvatarSelector && (
                <div className="absolute top-0 right-0 w-full h-fit flex flex-col justify-center items-center border border-zinc-500/80 bg-zinc-800/90 backdrop-blur-md rounded-lg">
                  <div className="flex w-[90%] py-4 gap-2 flex-col">
                    <span className="text-sm text-white font-bold">
                      Choose the avatar that best represents you now.{" "}
                    </span>
                    <span className="text-xs text-white/80">
                      The selected avatar will be shown on your profile, posts
                      and for other users, you can change it whenever you want.
                    </span>
                  </div>

                  <div className="w-full flex gap-2 p-2 justify-center items-center flex-wrap">
                    {avatarPath.map((avatar) => {
                      return (
                        <div
                          key={avatar}
                          onClick={() => handleClickSelectAvatar(avatar)}
                          className={`${
                            selectedAvatar === avatar
                              ? "bg-purple-500 ring-2 ring-white"
                              : "bg-zinc-600"
                          } relative cursor-pointer w-fit h-fit flex p-1 rounded-md justify-center items-center transition-all hover:bg-purple-500`}
                        >
                          <img
                            src={`/images/${avatar}`}
                            className="w-12 h-12"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
