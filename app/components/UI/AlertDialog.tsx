import * as AlertDialog from "@radix-ui/react-alert-dialog";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "app/store";
interface Props {
  children: ReactNode;
  setMenuIsOpen: (arg: boolean) => void;
}

export default function LogoutDialog({ children, setMenuIsOpen }: Props) {
  const router = useRouter();

  const { logout } = useStore();

  const handleClickLogout = () => {
    setMenuIsOpen(false);
    logout();
    router.push("/auth/signIn");
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
          <AlertDialog.Content className="w-[300px] sm:w-[500px] h-fit p-6 bg-zinc-800 border border-zinc-700 rounded-lg">
            <AlertDialog.Title className="text-white text-sm sm:text-md font-bold">
              Are you sure you want to log out?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-white/50 text-xs sm:text-sm pt-4">
              If you log out now, you will not be able to see the latest posts
              and will have to log in again to access the app.
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
                  onClick={handleClickLogout}
                  className="outline-none bg-red-200 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 rounded-md text-red-500 font-semibold mt-6 transition-all hover:bg-red-300"
                >
                  Logout.
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
