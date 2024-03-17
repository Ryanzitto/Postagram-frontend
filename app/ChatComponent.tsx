import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useStore } from "./store";
import { Eye, EyeOff, Send } from "lucide-react";
import { format } from "date-fns";

interface ServerToClientEvents {
  message: (data: {
    text: string;
    username: string;
    createdAt: string;
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
  }) => void;
  userConnected: (data: string) => void;
  userDisconnected: (data: string) => void;
}

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
    }[]
  >(chatMessages);
  const [inputValue, setInputValue] = useState<string>("");

  const [shouldShowChat, setShouldShowChat] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(user.userName);

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
    console.log(connectedUsers);
  }, [connectedUsers]);

  useEffect(() => {
    console.log(connectedUsers);
  }, [shouldShowChat]);
  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center bg-zinc-800">
      <div className="w-full  px-3 py-3 md:px-4 md:py-4 flex gap-2 justify-between items-center rounded-lg bg-purple-500">
        <h2 className="text-xs text-white/80 font-bold">Global Chat</h2>
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
      {shouldShowChat && (
        <div className="mt-2 w-[300px] h-[400px] flex flex-col gap-1 py-2 border border-zinc-500/80 justify-between items-center rounded-md">
          {pageIsLoad && (
            <div
              ref={chatRef}
              className="p-1 w-full h-[90%] gap-1 flex flex-col overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <div
                  className={`${
                    msg.username === user.userName ? "items-end" : "items-start"
                  } w-full flex flex-col px-2`}
                  key={index}
                >
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
                    <span className="text-xs text-white p-2">{msg.text}</span>
                  </div>
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
        </div>
      )}
    </div>
  );
}
