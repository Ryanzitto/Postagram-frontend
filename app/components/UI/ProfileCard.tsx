import axios from "axios";
import { useStore } from "app/store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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

  const { user } = useStore();

  const [userHasFollowed, setUserHasFollowed] = useState<boolean>();

  const [followers, setFollowers] = useState<number>(0);

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

  return (
    <div className="p-4 lg:p-0 h-full w-full sm:w-[80%] md:min-w-[350px] md:min-h-[400px] flex flex-col lg:justify-start justify-center items-center">
      {userProfile && (
        <div className="p-4 w-[90%] flex h-fit flex-col justify-center rounded-lg bg-zinc-700/50 border border-zinc-500/80 items-center">
          <img
            className="w-16 h-16 md:w-18 md:h-18 bg-white rounded-full p-2"
            src={`/images/${userProfile?.avatar}`}
          />

          <div className="w-full h-fit flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-1 mt-2">
              <span className="text-white font-bold tracking-widest text-sm md:text-md">
                {userProfile?.name}
              </span>
              <span className="text-white/50 text-xs ">
                @{userProfile?.userName}
              </span>
            </div>
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
                    className="bg-red-500 transition-all hover:bg-red-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider"
                  >
                    UNFOLLOW
                  </button>
                ) : (
                  <button
                    onClick={() => handleClickFollow(userProfile?._id)}
                    className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider"
                  >
                    FOLLOW
                  </button>
                )}

                <button className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-xs md:text-sm font-semibold tracking-wider">
                  CHAT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {userProfile === undefined && (
        <div className="skeleton-loading p-4 w-[90%] flex h-[260px] flex-col justify-center rounded-lg  items-center"></div>
      )}
    </div>
  );
}
