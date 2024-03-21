"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useStore } from "app/store";

interface Notification {
  text: string;
  username: string;
  createdAt: string;
  type: string;
  id: string;
}

export default function NotificationBar() {
  const { notifications, setNotification, clearNotification } = useStore();

  const [localNotifications, setlocalNotifications] = useState<Notification[]>(
    notifications.filter(
      (messages: Notification) => messages.type === "userMessage"
    )
  );
  const [shouldShowAlert, setShouldShowAlert] = useState<boolean>(false);

  const [shouldShowNotifications, setShouldShowNotifications] =
    useState<boolean>(false);

  useEffect(() => {
    setShouldShowAlert(true);
  }, [notifications]);

  useEffect(() => {
    if (shouldShowNotifications) {
      setShouldShowAlert(false);
    }
  }, [shouldShowNotifications]);

  const handleClickDeleteNotification = (id: string) => {
    let editedNotifications = localNotifications.filter(
      (notification) => notification.id !== id
    );
    setNotification(editedNotifications);
  };

  useEffect(() => {
    setlocalNotifications(notifications);
  }, [notifications]);

  return (
    <>
      <div className="w-full flex flex-col items-end h-fit">
        <div className="relative">
          {shouldShowAlert && (
            <div className="absolute w-4 h-4 rounded-full bg-red-500 top-0 right-0 -mt-1 -mr-1" />
          )}
          <Bell
            onClick={() => setShouldShowNotifications(!shouldShowNotifications)}
            className="cursor-pointer text-white/80 transition-all hover:text-white/50"
          />
        </div>
      </div>
      <AnimatePresence>
        {shouldShowNotifications && (
          <div className="mt-8 max-h-[400px] flex flex-col overflow-x-hidden overflow-y-auto">
            {localNotifications.map((notification, index) => {
              return (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.2 * index,
                      duration: 1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 30,
                    transition: {
                      delay: 0.2 * index,
                      duration: 0.1,
                    },
                  }}
                  className=" w-full p-2 flex justify-end h-fit"
                >
                  <div className="w-full h-fit rounded-md flex justify-between border border-zinc-500/80 bg-zinc-700/50">
                    <div className="w-[90%] flex p-3">
                      <span className="text-[10px] text-white/80">
                        {notification.username} send a message on global chat.
                      </span>
                    </div>
                    <div className="w-[10%] py-3 flex justify-center rounded-tr-md items-center">
                      <X
                        onClick={() =>
                          handleClickDeleteNotification(notification.id)
                        }
                        className=" w-4 h-4 cursor-pointer text-white/80 transition-all hover:text-white/50"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
