import { MoreHorizontal, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "app/store";
import axios from "axios";

const Load = () => {
  return (
    <span className="text-white tracking-widest font-bold text-lg">...</span>
  );
};

export default function Aside() {
  const { user } = useStore();

  const [pageIsLoad, setPageIsLoad] = useState<boolean>(false);

  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${URL}/post/byUserName/${user.userName}`)
      .then((response) => {
        console.log(response);
        setTotalPostsUser(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setPageIsLoad(true);
  }, []);

  return (
    <>
      <div className="w-[25%] h-full p-4">
        {/* <div className="relative w-[90%] h-[350px] bg-zinc-700 flex flex-col border border-zinc-500/80 rounded-md ">
          <div className="absolute w-full h-full flex justify-center items-center">
            <div className="w-24 h-24 p-1 bg-zinc-700 rounded-md self-center justify-self-center mb-24">
              {pageIsLoad && (
                <img className="rounded-md" src={`/images/${user?.avatar}`} />
              )}
            </div>
          </div>
          <div className="bg-purple-500 w-full h-1/3 rounded-t-md flex">
            <div className="w-[90%] h-fit flex p-6">
              <span className="text-zinc-600/80 font-bold tracking-wider">
                POSTS: {totalPostsUser}
              </span>
            </div>
            <div className="w-[10%] flex justify-end items-start pt-4 pr-4">
              <div className="rounded-md w-6 h-6 bg-zinc-800/50 p-1 flex justify-center items-center">
                <MoreHorizontal className="cursor-pointer text-white w-4 rotate-90 flex" />
              </div>
            </div>
          </div>
          <div className="w-full h-2/3 rounded-b-md flex flex-col items-center">
            <div className="w-full flex h-fit p-1 justify-between">
              <div className="w-20 pt-2 flex flex-col text-center">
                {pageIsLoad ? (
                  <span className="text-sm text-white font-semibold">
                    {user?.followers?.length}
                  </span>
                ) : (
                  <Load />
                )}
                <span className="text-xs text-white/50 font-normal">
                  Followers
                </span>
              </div>
              <div className="w-20 pt-2 flex flex-col text-center">
                {pageIsLoad ? (
                  <span className="text-sm text-white font-semibold">
                    {user?.following?.length}
                  </span>
                ) : (
                  <Load />
                )}
                <span className="text-xs text-white/50 font-normal">
                  Following
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center h-fit p-1 mt-2">
              {pageIsLoad ? (
                <span className="text-md text-white font-semibold">
                  {user?.name}
                </span>
              ) : (
                <Load />
              )}
              {pageIsLoad ? (
                <span className="text-xs text-white/50 font-normal">
                  @{user?.userName}
                </span>
              ) : (
                <Load />
              )}
            </div>
            <div className="w-[90%] h-[1px] bg-zinc-800/30 mt-4 mb-4"></div>
            <div className="w-full flex flex-col justify-center items-center text-center h-fit px-6 py-6">
              <span className="text-xs z-40 text-white/80 font-normal">
                Hi, Im Leon Arc and I love this App. 🛸👽
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
