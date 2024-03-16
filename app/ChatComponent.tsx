"use client";
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useStore } from "./store";
import { Eye, EyeOff, Send } from "lucide-react";
interface ServerToClientEvents {
  message: (data: { text: string; username: string }) => void; // Evento para receber mensagens do servidor
}

interface ClientToServerEvents {
  message: (data: { text: string; username: string }) => void; // Evento para enviar mensagens para o servidor
}

export default function ChatComponent() {
  const URL = process.env.NEXT_PUBLIC_SOCKETURL;
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    `http://localhost:3002`
  );

  const { user, chatMessages, addChatMessage } = useStore();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const [messages, setMessages] =
    useState<{ text: string; username: string }[]>(chatMessages);

  const [inputValue, setInputValue] = useState<string>("");

  const [shouldShowChat, setShouldShowChat] = useState<boolean>(false);

  const [username, setUsername] = useState<string>(user.userName); // Adicione o estado do nome de usuário

  const handleMessageSend = (e: any) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Enviar mensagem para o servidor, incluindo o nome de usuário
    socket.emit("message", { text: inputValue, username: username });
    setInputValue("");
  };

  useEffect(() => {
    // Configurar o recebimento de mensagens do servidor
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      addChatMessage(data);
    });

    // Limpar o listener quando o componente é desmontado
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center bg-zinc-800">
      <div className="w-full flex gap-2 items-center">
        <h2 className="text-sm text-white/80 font-bold">Global Chat </h2>
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
        <div className="mt-2 w-[300px] h-[400px] flex flex-col gap-1 py-2 border border-zinc-500/80 s justify-between items-center rounded-md">
          {pageIsLoad && (
            <div className="p-1 w-full h-[90%] gap-1 flex flex-col justify-end overflow-auto">
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
                    <span
                      className={`${
                        msg.username === user.userName
                          ? "text-purple-500"
                          : "text-white/50"
                      } text-xs p-1 px-2 font-semibold`}
                    >
                      {msg.username === user.userName
                        ? "You"
                        : "@" + msg.username}
                    </span>
                    <div className="w-full h-[1px] bg-zinc-500"></div>
                    <span className="text-xs text-white p-2"> {msg.text}</span>
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
              className="rounded-sm bg-transparent text-white/80 text-xs outline-none w-[90%]"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="w-[10%] flex justify-center items-center">
              <Send
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
