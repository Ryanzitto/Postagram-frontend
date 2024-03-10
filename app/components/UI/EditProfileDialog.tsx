import React, { ReactNode, useEffect } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "app/store";
import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "app/zodSchema/EditProfile";

interface User {
  bio: string;
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
  totalPosts: number;
}

type FormData = z.infer<typeof editProfileSchema>;
interface Props {
  setshouldShowEditProfile: (arg: boolean) => void;
  updateUser: () => void;
  actualUser: User | undefined;
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

export default function EditDialog({
  setshouldShowEditProfile,
  updateUser,
  actualUser,
}: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const { logout, setEditedUser, user } = useStore();

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [inputBioContent, setInputBioContent] = useState<string>(user.bio);

  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);

  const [shouldShowAvatarSelector, setShouldShowAvatarSelector] =
    useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editProfileSchema),
  });

  async function onSubmit() {
    const formatedData = {
      avatar: selectedAvatar,
      bio: inputBioContent,
    };

    axios
      .put(`${URL}/user/${user._id}`, formatedData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("user successfully updated");
        setshouldShowEditProfile(false);
        setEditedUser(formatedData.bio, formatedData.avatar);
        setSelectedAvatar(formatedData.avatar);
        updateUser();
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data.message);
        toast.error("An unexpected error occurred");
      });
  }

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

  const handleClickCancel = () => {
    setshouldShowEditProfile(false);
  };

  useEffect(() => {
    setErrorMessage(null);
  }, [inputBioContent]);

  return (
    <div className="mt-10 w-full flex flex-col items-center h-fit p-6 bg-zinc-800 border border-zinc-700 rounded-lg">
      <div className="flex flex-col gap-2 w-full">
        <span className="text-white text-sm sm:text-md font-bold">
          Make changes to your profile here. Click save when you're done.
        </span>
        <span className="text-white/50 text-xs pt-2">
          The changes will be aplied to your profile.
        </span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full justify-center items-center bg-zinc-900/50 flex flex-col rounded-md gap-4 my-4 p-6"
      >
        <div className="flex w-full gap-1">
          <div
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputBioContent(e.target.value)
            }
            className="flex flex-col w-[70%] sm:w-[80%]"
          >
            <label className="text-white text-xs">Bio</label>
            <textarea
              {...register("bio")}
              id="bio"
              name="bio"
              value={inputBioContent}
              placeholder={"Write a new bio."}
              className={`focus:border-purple-500 ${
                inputBioContent ? "border-purple-500" : "border-zinc-500/80"
              } text-sm sm:text-md mt-2 bg-transparent w-full outline-none border  rounded-md pl-6 pt-2 text-white/80 font-semibold placeholder:font-normal placeholder:text-zinc-600/50`}
            />
          </div>
          <div className="flex flex-col w-[30%]  sm:w-[20%] gap-1 justify-center items-center">
            <label className="text-white text-xs">Avatar</label>
            <div
              onClick={() => setShouldShowAvatarSelector(true)}
              className="cursor-pointer w-fit h-fit flex flex-col justify-center items-center rounded-lg p-1 bg-zinc-700/80 transition-all hover:bg-purple-500"
            >
              <img className="w-12 h-12" src={`/images/${selectedAvatar}`} />
            </div>
          </div>
        </div>
        <div className="flex w-full">
          {errors?.bio && (
            <p className="text-red-600 text-xs pt-1">{errors?.bio?.message}</p>
          )}
        </div>
        <input
          {...register("avatar")}
          id="avatar"
          name="avatar"
          value={selectedAvatar}
          className="hidden"
        />
        <div className="flex flex-col w-full justify-start items-center gap-2">
          {shouldShowAvatarSelector && (
            <div className="w-full pb-4 sm:w-[80%] h-fit flex flex-col justify-center items-center border border-zinc-500/80 bg-zinc-800/90 backdrop-blur-md rounded-lg">
              <div className="flex w-[90%] py-4 gap-2 flex-col">
                <span className="text-sm text-white font-bold">
                  Choose the avatar that best represents you now.{" "}
                </span>
                <span className="text-xs text-white/80">
                  The selected avatar will be shown on your profile, posts and
                  for other users, you can change it whenever you want.
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
                      <img src={`/images/${avatar}`} className="w-12 h-12" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex w-full justify-center gap-4">
            <button
              onClick={handleClickCancel}
              className="outline-none bg-zinc-300 text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-zinc-600 font-semibold mt-6 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleClickDelete}
              className="outline-none bg-purple-500 text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-white font-semibold mt-6 transition-all hover:bg-purple-600"
            >
              <span>Save</span>
            </button>
          </div>
        </div>
        {errorMessage !== null && (
          <p className="text-red-600 text-xs pt-1">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
