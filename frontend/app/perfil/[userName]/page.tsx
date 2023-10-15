"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  avatar: string;
  email: string;
  name: string;
  userName: string;
  id: string;
  bio: string;
}

export default function Perfil({ params }: { params: { userName: string } }) {
  const [userName, setUserName] = useState<string | null>(params.userName);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUserName(params.userName);
    const baseUrl = "http://localhost:3000";
    axios
      .get(`${baseUrl}/user/${userName}`)
      .then((response) => {
        console.log(response);
        setUser(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-screen bg-white justify-start items-center">
      <div className="w-[50%] h-full flex flex-col gap-4 pt-10">
        <div
          className="bg-blue-500 w-full h-[200px] relative flex justify-start items-end relative"
          style={{
            backgroundImage:
              "url('https://www.pixground.com/clouds-meet-the-sea-ai-generated-4k-wallpaper/?download-img=hd')",
            backgroundSize: "cover",
          }}
        >
          <div className="flex">
            <div className="absolute -mt-16 ml-20 bg-zinc-800 rounded-full border-4 border-zinc-800 justify-center items-center">
              <div
                className="w-32 h-32 rounded-full"
                style={{
                  backgroundImage: `url(${user?.avatar})`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="w-full mt-20 flex flex-col justify-center items-center">
          <div className="w-[80%] flex flex-col gap-2 pl-6">
            <h1 className="text-3xl font-bold text-zinc-800">{user?.name}</h1>
            <h2 className="text-md font-medium text-zinc-800/80">
              @{user?.userName}
            </h2>
          </div>
          <div className="w-[80%] pl-6 rounded-md text-sm pt-2">
            {user?.bio}
          </div>
        </div>
      </div>
    </div>
  );
}
