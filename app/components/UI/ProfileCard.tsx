import axios from "axios";
import { useStore } from "app/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  bio: string;
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
}

interface Props {
  userProfile: UserProfile | undefined;
  totalPostsUser: number;
}

export default function ProfileCard({ userProfile, totalPostsUser }: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const router = useRouter();

  const { user } = useStore();

  const [userHasFollowed, setUserHasFollowed] = useState<boolean>();

  const [followers, setFollowers] = useState<number>(0);

  const [shouldShowFollowers, setShouldShowFollowers] =
    useState<boolean>(false);
  const [shouldShowFollowing, setShouldShowFollowing] =
    useState<boolean>(false);

  const [isWhite, setIsWhite] = useState(true);

  const handleClickFollow = (userToFollowId: string | undefined) => {
    axios
      .post(`${URL}/user/follow/${userToFollowId}`, { userId: user._id })
      .then((response) => {
        console.log(response);
        setFollowers((prevValue) => prevValue + 1);
        setUserHasFollowed(!userHasFollowed);
        toast.success("User successfully followed");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something wrong ocurred");
      });
  };

  const handleClickUnFollow = (userToUnFollowId: string | undefined) => {
    axios
      .post(`${URL}/user/unfollow/${userToUnFollowId}`, { userId: user._id })
      .then((response) => {
        console.log(response);
        toast.success("User successfully unfollowed");
        setFollowers((prevValue) => prevValue - 1);
        setUserHasFollowed(!userHasFollowed);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something wrong ocurred");
      });
  };

  const handleClickUserName = (username: string) => {
    router.push(`${username}`);
  };

  useEffect(() => {
    if (userProfile) {
      setUserHasFollowed(
        userProfile?.followers.some(
          (userProfile) => userProfile._id === user._id
        )
      );
      setFollowers(userProfile.followers.length);
    }
  }, [userProfile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWhite((prevState) => !prevState);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative background-animate sm:rounded-md bg-gradient-to-br from-purple-400  to-purple-800 lg:bg-none p-4 lg:p-0 h-full w-full sm:w-[80%] md:min-w-[350px] md:min-h-[400px] flex flex-col lg:justify-start justify-center items-center">
      <div className="lg:hidden overflow-hidden w-full h-full absolute flex p-0 sm:p-4 gap-0 sm:gap-2 flex-col break-words text-center justify-center items-center">
        <span
          className={`text-xl sm:text-2xl md:text-3xl ${
            isWhite ? "text-white/30" : "text-zinc-600"
          } font-black tracking-widest transition-all duration-[1000ms]`}
        >
          POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP
        </span>
        <span
          className={`text-xl sm:text-2xl md:text-3xl ${
            isWhite ? "text-zinc-600" : "text-white/30"
          } font-black tracking-widest transition-all duration-[1000ms]`}
        >
          POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP
        </span>
        <span
          className={`text-xl sm:text-2xl md:text-3xl ${
            isWhite ? "text-white/30" : "text-zinc-600"
          } font-black tracking-widest transition-all duration-[1000ms]`}
        >
          POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP
        </span>
        <span
          className={`text-xl sm:text-2xl md:text-3xl ${
            isWhite ? "text-zinc-600" : "text-white/30"
          } font-black tracking-widest transition-all duration-[1000ms]`}
        >
          POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP POSTAPP
        </span>
      </div>
      {userProfile && (
        <div className="z-20 p-4 w-[90%]  max-w-[350px] flex h-fit flex-col justify-center rounded-lg bg-zinc-700 border border-zinc-500/80 items-center">
          <div className="flex w-full px-4 gap-6 items-start">
            <img
              className="w-16 h-16 md:w-18 md:h-18 bg-zinc-800/50 rounded-lg p-1"
              src={`/images/${userProfile?.avatar}`}
            />
            <div className="flex flex-col justify-start items-start mt-2">
              <span className="text-white font-bold tracking-widest text-sm md:text-lg transition-all duration-[1000ms]">
                {userProfile?.name}
              </span>
              <span className="text-white/50 text-xs md:text-sm">
                @{userProfile?.userName}
              </span>
            </div>
          </div>

          <div className="w-full h-fit flex flex-col justify-center items-center">
            <div className="w-[250px] md:w-[300px] h-fit flex px-2 mt-4">
              <div className="flex w-1/3 flex-col gap-1 text-center">
                <span className="text-white text-xs font-bold">Posts</span>
                <span className="text-white/50 text-xs">{totalPostsUser}</span>
              </div>
              <div className="flex w-1/3 flex-col gap-1 text-center">
                <span className="text-white text-xs font-bold">Followers</span>
                <span className="text-white/50 text-xs">{followers}</span>
              </div>
              <div className="flex w-1/3 flex-col gap-1 text-center">
                <span className="text-white text-xs font-bold">Following</span>
                <span className="text-white/50 text-xs">
                  {userProfile?.following.length}
                </span>
              </div>
            </div>
            <div className="w-[80%] h-[1px] bg-zinc-500/30 mt-4 mb-4"></div>
            <div className="w-full flex flex-col justify-center items-center text-center h-fit px-2 mt-2">
              <span className="text-xs text-white/80 font-normal">
                {userProfile?.bio}
              </span>
            </div>
            {userProfile?._id !== user._id && (
              <div className="flex w-full justify-center items-center gap-3 mt-6">
                {userHasFollowed ? (
                  <button
                    onClick={() => handleClickUnFollow(userProfile?._id)}
                    className="bg-red-500 transition-all duration-[1000ms] hover:bg-red-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider"
                  >
                    UNFOLLOW
                  </button>
                ) : (
                  <button
                    onClick={() => handleClickFollow(userProfile?._id)}
                    className="bg-purple-500 transition-all duration-[1000ms] hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider"
                  >
                    FOLLOW
                  </button>
                )}

                <button className="bg-purple-500 transition-all duration-[1000ms] hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider">
                  CHAT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {userProfile === undefined && (
        <div className="skeleton-loading p-4 w-[90%] flex h-[200px] flex-col justify-center rounded-lg  items-center"></div>
      )}
      <div className="z-20 w-[90%] max-w-[350px] mt-4 rounded-lg lg:w-full h-fit flex flex-col gap-4 p-4 lg:border-none border border-zinc-500/80 bg-zinc-700 lg:bg-transparent">
        <div className="flex flex-col w-full h-fit">
          <div
            onClick={() => setShouldShowFollowers(!shouldShowFollowers)}
            className="flex gap-2 w-fit cursor-pointer text-white/50 transition-all hover:text-white/30"
          >
            <span className=" text-sm">Followers</span>
            {shouldShowFollowers ? (
              <ChevronDown className="w-4 " />
            ) : (
              <ChevronRight className="w-4 " />
            )}
          </div>
          {shouldShowFollowers && (
            <div className="flex w-full h-fit rounded-md p-2 bg-zinc-700/50 border border-zinc-500/60 flex-wrap">
              {userProfile?.followers.map((follower) => {
                return (
                  <span
                    onClick={() => handleClickUserName(follower.userName)}
                    className="text-white/30 text-xs transition-all cursor-pointer hover:text-white/80"
                  >
                    @{follower.userName}
                  </span>
                );
              })}
              {userProfile?.followers.length === 0 && (
                <span className="text-white/50 text-sm">No Followers</span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full h-fit">
          <div
            onClick={() => setShouldShowFollowing(!shouldShowFollowing)}
            className="flex gap-2 w-fit cursor-pointer text-white/50 transition-all hover:text-white/30"
          >
            <span className=" text-sm">Following</span>

            {shouldShowFollowing ? (
              <ChevronDown className="w-4 " />
            ) : (
              <ChevronRight className="w-4 " />
            )}
          </div>
          {shouldShowFollowing && (
            <div className="flex w-full h-fit rounded-md p-2 bg-zinc-700/50 border border-zinc-500/60 flex-wrap">
              {userProfile?.following.map((following) => {
                return (
                  <span
                    onClick={() => handleClickUserName(following.userName)}
                    className="text-white/30 text-xs transition-all cursor-pointer hover:text-white/80"
                  >
                    @{following.userName}
                  </span>
                );
              })}
              {userProfile?.following.length === 0 && (
                <span className="text-white/50 text-sm">
                  Following 0 users.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
