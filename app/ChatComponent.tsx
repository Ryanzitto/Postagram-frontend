import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useStore } from "./store";
import { Eye, EyeOff, Send } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ServerToClientEvents {
  message: (data: {
    text: string;
    username: string;
    createdAt: string;
    type: string;
  }) => void;
  userConnected: (data: string) => void;
  userDisconnected: (data: string) => void;
  updateUsers: (users: string[]) => void;
}

interface ClientToServerEvents {
  message: (data: {
    text: string;
    username: string;
    createdAt: string;
    type: string;
  }) => void;
  userConnected: (data: string) => void;
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
    connectedUsers,
    addChatMessage,
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

  const [shouldShowAlert, setShouldShowAlert] = useState<boolean>(false);
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
      if (shouldShowChat === true) {
        return;
      }
      setShouldShowAlert(true);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  useEffect(() => {
    if (shouldShowChat) {
      scrollToBottom();
    }
  }, [messages, shouldShowChat]);

  useEffect(() => {
    if (user.userName !== "") {
      // Enviar o nome de usuário para o backend quando o componente for montado
      socket.emit("userConnected", user.userName);

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
  }, [user.userName]); // Executar o useEffect sempre que o nome de usuário mudar

  useEffect(() => {
    if (shouldShowChat) {
      setShouldShowAlert(false);
    }
  }, [shouldShowChat]);
  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center bg-zinc-800">
      {pageIsLoad ? (
        <div className="relative w-full  px-3 py-3 md:px-4 md:py-4 flex gap-2 justify-between items-center rounded-lg bg-purple-500">
          {shouldShowAlert && (
            <div className="absolute w-4 h-4 rounded-full bg-red-500 top-0 right-0 -mt-1 -mr-1" />
          )}
          <span className="text-xs text-white/80 font-bold">Global Chat</span>
          {shouldShowChat ? (
            <EyeOff
              className="w-5 cursor-pointer text-white/50 transition-all hover:text-white/30"
              onClick={() => setShouldShowChat(false)}
            />
          ) : (
            <Eye
              className="w-5 cursor-pointer text-white/50 transition-all hover:text-white/30"
              onClick={() => setShouldShowChat(true)}
            />
          )}
        </div>
      ) : (
        <Skeleton />
      )}
      <AnimatePresence>
        {shouldShowChat && (
          <>
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
              className="w-full flex gap-2 pl-2 mt-2"
            >
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-white/80">
                {connectedUsers.length} Online user(s).
              </span>
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
              className="mt-2 w-[300px] h-[400px] flex flex-col gap-1 py-2 border border-zinc-500/80 justify-between items-center rounded-md"
            >
              {pageIsLoad && (
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
                          } w-fit max-w-[90%] break-all flex flex-col rounded-md `}
                        >
                          <div className="flex px-2 py-1 gap-2 justify-start items-center">
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
                              <span className="text-[10px] text-white/50">
                                {format(msg.createdAt, "HH:mm, dd/MM/yyyy")}
                              </span>
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
                          <span className="text-xs text-white/50 p-2">
                            {msg.text}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleMessageSend}
                className="w-[95%] bg-zinc-700 h-fit rounded-md flex items-center justify-between p-2"
              >
                <input
                  placeholder="Message..."
                  className="rounded-sm pl-4 bg-transparent text-white/80 text-xs outline-none w-[90%]"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="w-[10%] flex justify-center items-center">
                  <Send
                    onClick={handleMessageSend}
                    type="submit"
                    className="w-5 cursor-pointer text-white/80 transition-all hover:text-white/50"
                  />
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
