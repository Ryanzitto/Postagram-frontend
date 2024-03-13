import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

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

const Skeleton = () => {
  return (
    <div
      className={`rounded-lg skeleton-loading w-full h-fit px-3 py-3 md:px-4 md:py-4 flex justify-between items-center bg-purple-500`}
    >
      <Eye className="cursor-pointer text-transparent w-5 h-5 transition-all hover:text-white/30" />
    </div>
  );
};

export default function Aside() {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${URL}/user/`)
      .then((response) => {
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

  return (
    <>
      <div className="flex flex-row md:flex-col w-full md:w-[25%] h-fit p-4 gap-4">
        <div className="bg-zinc-700/50 max-w-[300px] flex gap-0 flex-col w-1/2 md:w-full h-fit rounded-lg">
          {users.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: 0,
                duration: 1,
              }}
              className={`${
                shouldShowRanking ? "rounded-t-lg" : "rounded-lg"
              } w-full h-fit px-3 py-3 md:px-4 md:py-4 flex justify-between items-center bg-purple-500`}
            >
              <span className="pl-0 font-black text-xs sm:text-sm sm:text-md lg:text-lg text-white text-center">
                Ranking PostApp
              </span>
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
            </motion.div>
          )}
          {users.length === 0 && <Skeleton />}
          <AnimatePresence>
            {shouldShowRanking && (
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
                    duration: 0.1,
                  },
                }}
                className="w-full  h-fit flex flex-col"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
