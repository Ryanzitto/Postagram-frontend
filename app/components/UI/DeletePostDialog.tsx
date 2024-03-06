import React, { ReactNode, useEffect } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useStore } from "app/store";
import axios from "axios";
import { toast } from "sonner";
interface Props {
  children: ReactNode;
  postID: string;
  setPostDeleted: (arg: boolean) => void;
}

export default function DeleteDialog({
  children,
  postID,
  setPostDeleted,
}: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;
  const router = useRouter();

  const { logout, user } = useStore();

  const handleClickDelete = () => {
    axios
      .delete(`${URL}/post/${postID}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success("Post successfully deleted.");
        setPostDeleted(true);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An unexpected error occurred");
      });
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
          <AlertDialog.Content className="w-[300px] sm:w-[500px] h-fit p-6 bg-zinc-800 border border-zinc-700 rounded-lg">
            <AlertDialog.Title className="text-white text-sm sm:text-md font-bold">
              Are you sure you want to delete this post?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-white/50 text-xs sm:text-sm pt-4">
              This action is irreversible, if you delete the post you will not
              be able to recover it.
            </AlertDialog.Description>
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
                  className="outline-none bg-red-200 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-red-500 font-semibold mt-6 transition-all hover:bg-red-300"
                >
                  Delete.
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
