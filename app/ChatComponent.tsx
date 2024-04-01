import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useStore } from "./store";
import { Eraser, Send, X } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

interface User {
  username: string;
  name: string;
  avatar: string;
}

interface ServerToClientEvents {
  message: (data: {
    text: string;
    username: string;
    createdAt: string;
    type: string;
    id: string;
  }) => void;

  userConnected: (data: User) => void;
  userDisconnected: (data: string) => void;

  updateUsers: (users: User[]) => void;
}

interface ClientToServerEvents {
  message: (data: {
    text: string;
    username: string;
    createdAt: string;
    type: string;
    id: string;
  }) => void;
  userConnected: (data: User) => void;
  userDisconnected: (data: string) => void;
}

const Skeleton = () => {
  return <div className="rounded-md skeleton-loading w-32 h-12"></div>;
};

export default function ChatComponent() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    `${URL}`
  );

  const chatRef = useRef<HTMLDivElement>(null);

  const {
    user,
    chatMessages,
    notifications,
    connectedUsers,
    addChatMessage,
    addNotification,
    setConnectedUsers,
  } = useStore();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const [messages, setMessages] = useState<
    {
      text: string;
      username: string;
      createdAt: string;
      type: string;
    }[]
  >(chatMessages);

  const [inputValue, setInputValue] = useState<string>("");

  const [shouldShowChat, setShouldShowChat] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(user.userName);

  const [chatIsOpen, setChatIsOpen] = useState<boolean>(false);

  const handleMessageSend = (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Criar uma nova data
    const createdAt = new Date().toISOString();
    // Enviar mensagem para o servidor, incluindo o nome de usuário
    socket.emit("message", {
      text: inputValue,
      username: username,
      createdAt: createdAt,
      type: "userMessage",
      id: crypto.randomUUID(),
    });
    setInputValue("");
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      addChatMessage(data);
      addNotification(data);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user.userName !== "") {
      // Enviar o nome de usuário para o backend quando o componente for montado
      socket.emit("userConnected", {
        username: user.userName,
        avatar: user.avatar,
        name: user.name,
      });

      // Atualizar a lista de usuários conectados quando receber uma atualização do servidor
      socket.on("updateUsers", (users) => {
        setConnectedUsers(users);
      });

      // Remover o listener quando o componente for desmontado
      return () => {
        socket.emit("userDisconnected", user.userName);
        socket.off("updateUsers");
      };
    }
  }, [user.userName]);

  const handleClickOpenChat = () => {
    setShouldShowChat(true);
    setChatIsOpen(true);
  };

  const handleClickCloseChat = () => {
    setShouldShowChat(false);
    setChatIsOpen(false);
  };

  useEffect(() => {
    if (shouldShowChat) {
      const time = setTimeout(() => {
        scrollToBottom();
      }, 1000);
      return () => clearTimeout(time);
    }
  }, [shouldShowChat]);

  return (
    <Dialog.Root>
      <div className="w-fit h-fit flex flex-col justify-center items-center bg-zinc-800">
        {pageIsLoad ? (
          <Dialog.Trigger>
            <div
              onClick={handleClickOpenChat}
              className="relative w-full  px-3 py-3 md:px-4 md:py-4 flex gap-2 justify-between items-center rounded-md bg-purple-500"
            >
              <span className="text-xs text-white/80 font-bold">
                Global Chat
              </span>
            </div>
          </Dialog.Trigger>
        ) : (
          <Skeleton />
        )}
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/50 flex justify-center items-center">
            <Dialog.Content className="relative w-[380px] sm:w-[800px] h-[500px] sm:h-fit flex bg-zinc-800  rounded-lg">
              <Dialog.Close
                onClick={handleClickCloseChat}
                className="absolute z-60 right-0 top-0 bg-zinc-700/50 transition-all p-2  rounded-tr-lg text-white/50 hover:text-white/80 hover:bg-purple-500"
              >
                <X className="w-4 h-4" />
              </Dialog.Close>
              {/* <div className="w-full">
                <span className="text-white/80 font-bold text-lg tracking-wider">
                  Global chat
                </span>
              </div> */}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: 0,
                    duration: 1,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    delay: 0,
                    duration: 0.2,
                  },
                }}
                className="w-[40%] h-[400px] flex flex-col p-4 rounded-md overflow-y-auto"
              >
                <span className="mb-4 text-white/30 text-xs">
                  Online users: {connectedUsers.length}
                </span>
                {connectedUsers.map((user: User) => {
                  return (
                    <div className="cursor-pointerw-full flex transition-all hover:bg-zinc-600/50 p-2 rounded-md">
                      <div className="w-10 h-10 relative  bg-purple-500 rounded-md">
                        <img
                          className="w-10 h-10"
                          src={`/images/${user.avatar}`}
                        />
                        <div className="absolute bottom-0 right-0 -mb-1 -mr-1 w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="pl-4 flex flex-col gap-1">
                        <span className="text-sm text-white/80 font-bold tracking-widest">
                          {user.name}
                        </span>
                        <span className="text-xs text-white/50">
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: 0,
                    duration: 1,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    delay: 0,
                    duration: 0.2,
                  },
                }}
                className="w-[60%] h-[500px] flex flex-col gap-1 py-2 border bg-white justify-between items-center rounded-r-md"
              >
                <div
                  ref={chatRef}
                  className="p-1 w-full h-[90%] gap-1 flex flex-col overflow-y-auto"
                >
                  {messages.map((msg, index) => (
                    <div
                      className={`${
                        msg.username === user.userName
                          ? "items-end"
                          : "items-start"
                      } w-full flex flex-col px-2`}
                      key={index}
                    >
                      {msg.type === "userMessage" && (
                        <div
                          className={`${
                            msg.username === user.userName
                              ? "bg-zinc-700"
                              : "bg-zinc-600"
                          } w-fit max-w-[90%] break-all flex flex-col rounded-md justify-center`}
                        >
                          <div className="flex px-3 py-2 gap-2 justify-start items-center">
                            <span
                              className={`${
                                msg.username === user.userName
                                  ? "text-purple-500"
                                  : "text-white/50"
                              } text-xs font-semibold`}
                            >
                              {msg.username === user.userName
                                ? "You"
                                : "@" + msg.username}
                            </span>
                            <span className="text-[10px] text-white/50">
                              {format(msg.createdAt, "HH:mm, dd/MM/yyyy")}
                            </span>
                          </div>
                          <div className="w-full h-[1px] bg-zinc-500"></div>
                          <span className="text-xs text-white p-2">
                            {msg.text}
                          </span>
                        </div>
                      )}
                      {msg.type === "systemMessage" && (
                        <div
                          className={`w-full items-center break-all flex flex-col `}
                        >
                          <span className="text-xs text-zinc-500 p-2">
                            {msg.text}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleMessageSend}
                  className="w-[95%] bg-zinc-700 h-fit rounded-md flex items-center justify-between p-2"
                >
                  <input
                    placeholder="Message..."
                    className="rounded-sm pl-4 bg-transparent text-white/80 text-xs outline-none w-[80%]"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="gap-2 flex justify-center items-center">
                    {/* <Eraser className="w-5 cursor-pointer text-white/80 transition-all hover:text-white/50" /> */}
                    <Send
                      onClick={handleMessageSend}
                      type="submit"
                      className="w-5 cursor-pointer text-white/80 transition-all hover:text-white/50"
                    />
                  </div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}
