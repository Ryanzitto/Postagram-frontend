import { Eye, EyeOff, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "app/store";
import axios from "axios";
import TooltipComponent from "./ToolTip";

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

  const [shouldShowRanking, setShouldShowRanking] = useState<boolean>(false);

  const [shouldShowDaily, setShouldShowDaily] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row md:flex-col w-full md:w-[25%] h-full p-4 gap-4">
        <div className="bg-zinc-700/50 max-w-[300px] flex gap-0 flex-col w-1/2 md:w-full h-fit rounded-lg border border-zinc-500/80">
          <div
            className={`${
              shouldShowRanking ? "rounded-t-lg" : "rounded-lg"
            } relative w-full h-fit px-4 py-4 flex flex-col justify-center items-center lg:items-start  bg-purple-500`}
          >
            <div className="top-0 left-0 absolute w-full flex justify-end pt-2 pr-2">
              {shouldShowRanking ? (
                <Eye
                  onClick={() => setShouldShowRanking(false)}
                  className="cursor-pointer text-white/50 w-5 h-5 transition-all hover:text-white/30"
                />
              ) : (
                <EyeOff
                  onClick={() => setShouldShowRanking(true)}
                  className="cursor-pointer text-white/50 w-5 h-5 transition-all hover:text-white/30"
                />
              )}
            </div>
            <span className="pl-0 font-black text-xs sm:text-sm sm:text-md lg:text-lg text-white text-center">
              Ranking PostApp
            </span>
            <span className="pl-0 text-xs text-white/80 text-center">
              users who posted the most
            </span>
          </div>
          {shouldShowRanking && (
            <div className="w-full  h-fit flex flex-col">
              {users.map((user, index) => {
                return (
                  <div
                    key={user._id}
                    className={`${
                      index >= 3 ? "hidden" : "flex"
                    } flex border-t border-zinc-500/80`}
                  >
                    <div className="w-[70%] h-24 flex items-center pl-4">
                      <div className="max-[500px]:hidden min-[501px]:flex md:hidden lg:flex h-14 items-center">
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
          )}
        </div>
        <div className="bg-zinc-700/50 max-w-[300px] flex gap-0 flex-col w-1/2 md:w-full h-fit rounded-lg border border-zinc-500/80">
          <div
            className={`${
              shouldShowDaily ? "rounded-t-lg" : "rounded-lg"
            } relative w-full  h-fit px-4 py-4 flex flex-col justify-center items-center lg:items-start  bg-purple-500`}
          >
            <div className="top-0 left-0 absolute w-full flex justify-end gap-2 pt-2 pr-2 items-center">
              <TooltipComponent
                content={
                  "You can use the prize word in the content of a post to win the respective prize. The validity of a prize word is 24 hours, after this period another prize word will be selected."
                }
              >
                <Info className="cursor-pointer text-white/50 w-4 h-4 transition-all hover:text-white/30" />
              </TooltipComponent>
              {shouldShowDaily ? (
                <Eye
                  onClick={() => setShouldShowDaily(false)}
                  className="cursor-pointer text-white/50 w-5 h-5 transition-all hover:text-white/30"
                />
              ) : (
                <EyeOff
                  onClick={() => setShouldShowDaily(true)}
                  className="cursor-pointer text-white/50 w-5 h-5 transition-all hover:text-white/30"
                />
              )}
            </div>
            <span className="pl-0 font-black text-xs sm:text-sm sm:text-md lg:text-lg text-white text-center">
              Daily Word
            </span>
            <span className="pl-0 text-xs text-white/80 text-center">
              Daily prized word
            </span>
          </div>
          {shouldShowDaily && (
            <div className="w-full p-4 rounded-b-md border-zinc-500/80 flex justify-center items-center h-fit">
              <span className="text-white/80 text-center">
                the award-winning word of the day is...{" "}
                <strong className="text-purple-500 font-black text-lg">
                  DEV
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
