"use client";

import Header from "../UI/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import Post from "../UI/Post";

interface Props {
  userNameProp: string;
}

interface Comment {
  comment: string;
  createdAt: string;
  idComment: string;
  userId: string;
  userName: string;
}

interface User {
  avatar: string;
  name: string;
  userName: string;
  email: string;
  __v: number;
  _id: string;
  followers: any[];
  following: any[];
}

interface Post {
  subject: string;
  text: string;
  bgColor: string;
  textColor: string;
  likes: [];
  comments: Comment[];
  createdAt: string;
  user: {
    name: string;
    userName: string;
    createdAt: string;
  };
  _id: string;
}

export default function ProfilePage({ userNameProp }: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;

  const [userProfile, setUserProfile] = useState<User>();

  const [posts, setPosts] = useState<Post[]>();

  const [totalPostsUser, setTotalPostsUser] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${URL}/user/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setUserProfile(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${URL}/post/byUserName/${userNameProp}`)
      .then((response) => {
        console.log(response);
        setTotalPostsUser(response.data.length);
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className="w-screen h-screen bg-zinc-800 flex flex-col justify-start items-start overflow-x-hidden">
      <Header />
      <div className="w-full h-[85%] flex justify-start items-start">
        <div className="w-[30%] h-full flex flex-col items-start pt-6 pl-6">
          <div className="relative min-w-[350px] min-h-[400px] flex flex-col justify-center rounded-lg bg-zinc-700/50 border border-zinc-500/80 items-center">
            <div className="w-full flex h-full flex-col justify-start items-center absolute">
              <div className="w-24 h-24 flex justify-center items-center rounded-lg bg-white mt-16">
                <img className="w-18 h-18" src="/images/cat-1.png" />
              </div>
              <div className="w-full h-fit flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-1 mt-2">
                  <span className="text-white font-bold tracking-widest">
                    {userProfile?.name}
                  </span>
                  <span className="text-white/50 text-xs ">
                    @{userProfile?.userName}
                  </span>
                </div>
                <div className="w-[300px] h-fit flex px-2 mt-4">
                  <div className="flex w-1/3 flex-col gap-1 text-center">
                    <span className="text-white text-xs font-bold">Posts</span>
                    <span className="text-white/50 text-xs">
                      {totalPostsUser}
                    </span>
                  </div>
                  <div className="flex w-1/3 flex-col gap-1 text-center">
                    <span className="text-white text-xs font-bold">
                      Followers
                    </span>
                    <span className="text-white/50 text-xs">
                      {userProfile?.followers.length}
                    </span>
                  </div>
                  <div className="flex w-1/3 flex-col gap-1 text-center">
                    <span className="text-white text-xs font-bold">
                      Following
                    </span>
                    <span className="text-white/50 text-xs">
                      {userProfile?.following.length}
                    </span>
                  </div>
                </div>
                <div className="w-[80%] h-[1px] bg-zinc-500/30 mt-4 mb-4"></div>
                <div className="w-full flex flex-col justify-center items-center text-center h-fit px-2 mt-2">
                  <span className="text-xs z-40 text-white/80 font-normal">
                    Hi, Im Leon Arc and I love this App. 🛸👽
                  </span>
                </div>
                <div className="flex w-full justify-center items-center gap-3 mt-6">
                  <button className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-sm font-semibold tracking-wider">
                    FOLLOW
                  </button>
                  <button className="bg-purple-500 transition-all hover:bg-purple-600 px-2 py-1.5 text-white rounded-md text-sm font-semibold tracking-wider">
                    CHAT
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full h-[30%] flex flex-col justify-center items-center rounded-t-lg bg-purple-500"></div>
            <div className="w-full h-[70%] flex flex-col justify-center items-center rounded-b-lg "></div>
          </div>
        </div>
        <div className="w-[70%] h-full max-h-full flex justify-start items-start pt-6">
          <div className="rounded-lg bg-zinc-700/50 w-[700px] h-fit flex flex-col items-start justify-start">
            <div className="w-full flex pl-4 pt-3">
              <span className="text-white/10 text-xs">Recents Posts</span>
            </div>
            <div className="w-full h-fit flex flex-col gap-4 justify-start items-start p-6">
              {posts?.map((post) => {
                return <Post post={post} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
