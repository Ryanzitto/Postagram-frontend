import React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";

interface User {
  bio: string;
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

interface Props {
  user: User;
  handleClickProfile: (username: string) => void;
}

export default function CardProfile({ user, handleClickProfile }: Props) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <img
          onClick={() => handleClickProfile(user.userName)}
          className="md:w-16 md:h-16 w-10 h-10 rounded-lg bg-zinc-800/90 backdrop-blur-md p-1 cursor-pointer transition-all hover:bg-purple-500"
          src={`/images/${user.avatar}`}
          alt="Radix UI"
        />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          sideOffset={5}
          className="w-64 md:w-80 rounded-md bg-zinc-800/80 backdrop-blur-md border border-zinc-500/80 p-4 z-40"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <img
              className="w-8 h-8 md:w-10 md:h-10  bg-zinc-700 rounded-lg"
              src={`/images/${user.avatar}`}
              alt="user avatar"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div>
                <div className="text-white text-sm md:text-md">{user.name}</div>
                <div
                  onClick={() => handleClickProfile(user.userName)}
                  className="cursor-pointer text-white/80 text-xs md:text-sm transition-all hover:text-white/50"
                >
                  @{user.userName}
                </div>
              </div>
              <div className="text-xs md:text-sm text-white">
                <span>{user.bio}</span>
              </div>
              <div style={{ display: "flex", gap: 15 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <div className="text-white text-xs md:text-sm">
                    {user.following.length}
                  </div>{" "}
                  <div className="text-white/50 font-light text-xs md:text-sm">
                    Following
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div className="text-white text-xs md:text-sm">
                    {user.followers.length}
                  </div>{" "}
                  <div className="text-white/50 font-light text-xs md:text-sm">
                    Followers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
