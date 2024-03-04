import { MoreHorizontal, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "app/store";
import axios from "axios";

interface User {
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

export default function Aside() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${URL}/user/`)
      .then((response) => {
        // Ordena os usuários com base no número de posts (do maior para o menor)
        const sortedUsers = response.data.sort(
          (a: User, b: User) => b.totalPosts - a.totalPosts
        );
        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="hidden md:flex w-[25%] h-full p-4">
        <div className="bg-zinc-700/50 flex gap-0 flex-col w-full h-fit rounded-lg border border-zinc-500/80">
          <div className="w-full h-fit py-4 pl-0 lg:pl-8 flex flex-col justify-center items-center lg:items-start  bg-purple-500 rounded-t-lg">
            <span className="font-black text-md lg:text-lg text-white">
              Ranking PostApp
            </span>
            <span className="text-xs text-white/80">
              users who posted the most
            </span>
          </div>
          <div className="w-full h-fit flex flex-col">
            {users.map((user, index) => {
              return (
                <div
                  key={user._id}
                  className={`${
                    index >= 3 ? "hidden" : "flex"
                  } flex border-t border-zinc-500/80`}
                >
                  <div className="w-[70%] h-24 flex items-center pl-0 lg:pl-4">
                    <div className="hidden lg:flex h-14 items-center">
                      <img
                        className="w-14 h-14 bg-white rounded-md"
                        src={`/images/${user.avatar}`}
                      />
                    </div>

                    <div className="flex h-24 flex-col pl-4 justify-center">
                      <span className="text-white/80 text-xs font-semibold cursor-pointer transition-all hover:text-white/50">
                        @{user.userName}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-white/50 text-xs font-semibold">
                          Posts:
                        </span>
                        <span className="text-white/50 text-xs font-semibold">
                          {user.totalPosts}
                        </span>
                      </div>
                      <span
                        className={`${index === 0 ? "bg-yellow-500" : ""} ${
                          index === 1 ? "bg-slate-300" : ""
                        } ${
                          index === 2 ? "bg-orange-900" : ""
                        } text-white text-xs font-bold w-fit px-1 rounded-sm mt-2`}
                      >
                        TOP {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="w-[30%] h-24 flex justify-center items-center">
                    {index === 0 && <span className="text-3xl">🥇</span>}
                    {index === 1 && <span className="text-3xl">🥈</span>}
                    {index === 2 && <span className="text-3xl">🥉</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
