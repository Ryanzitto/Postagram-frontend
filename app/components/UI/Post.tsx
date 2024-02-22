import { MoreHorizontal, Heart, MessageCircle, Send } from "lucide-react";
import axios from "axios";

interface Props {
  post: {
    subject: string;
    text: string;
    bgColor: string;
    textColor: string;
    likes: [];
    comments: [];
    user: {
      name: string;
      userName: string;
      createdAt: string;
    };
    _id: string;
  };
}

export default function Post({ post }: Props) {
  return (
    <div className="relative w-full h-fit bg-zinc-700/50 rounded-lg p-4 grid">
      <div className="justify-self-end mr-4 mt-4 absolute rounded-md w-6 h-6 bg-zinc-800/80 p-1 flex justify-center items-center">
        <MoreHorizontal className="cursor-pointer text-white w-4 rotate-90 flex" />
      </div>
      <div className="w-full flex h-fit">
        <div className="w-12 h-12 p-0.5 flex justify-center items-center bg-zinc-800/60 rounded-md">
          <img
            className="w-12 rounded-md"
            src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
          />
        </div>
        <div className="flex flex-col w-fit gap-0.5 pl-4">
          <span className="text-white/50 text-xs">@{post.user.userName}</span>
          <div className="flex gap-2 items-center">
            <span className="text-white text-lg font-bold">
              {post.user.name}
            </span>
            <div className="w-1 h-1 rounded-full bg-white" />
            <span className="text-white/50 text-xs">1 hour ago</span>
          </div>
        </div>
      </div>
      <div
        className={`text-xl font-bold text-white tracking-[10px] w-full h-fit flex mt-6`}
      >
        <span>{post.subject}</span>
      </div>
      <div className={`w-full h-fit flex ${post.bgColor} p-6 rounded-lg mt-4`}>
        <p
          className={`${post.textColor} text-2xl font-semibold tracking-wider`}
        >
          {post.text}
        </p>
      </div>
      <div className="w-full flex justify-between h-fit pt-4">
        <div className="flex gap-4 items-center">
          <Heart className="text-white w-5 cursor-pointer" />
          <MessageCircle className="text-white w-5 cursor-pointer" />
          <Send className="text-white w-5 cursor-pointer" />
        </div>
      </div>
      <div className="w-full h-[1px] bg-zinc-500/20 mt-4 mb-4 justify-self-center"></div>
      <div className="w-full flex h-12 justify-between ">
        <div className="w-[10%] flex items-center">
          <div className="w-12 h-12 p-0.5 flex justify-center items-center bg-zinc-800/60 rounded-md">
            <img
              className="w-12 rounded-md"
              src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
            />
          </div>
        </div>
        <div className="w-[89%] h-full flex text-sm rounded-xl  bg-zinc-800/60 justify-between items-center px-4">
          <input
            type="text"
            placeholder="What you think about this post?"
            className="w-full outline-none bg-transparent text-white/50 placeholder:text-white/30 "
          />
          <Send className="cursor-pointer text-white w-5" />
        </div>
      </div>
    </div>
  );
}
