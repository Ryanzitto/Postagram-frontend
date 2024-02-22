import { Home, MessageCircleMore, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-[15%] p-6 flex">
      <div className="w-1/3 h-full flex items-center gap-6">
        <div className="w-8 h-8 rounded-full flex justify-center items-center bg-white">
          <div className="w-4 h-4 rounded-sm bg-zinc-800"></div>
        </div>
        <input
          className="rounded-2xl w-48 h-8 bg-zinc-700/50 outline-none pl-4 text-slate-100/50"
          type="text"
        />
      </div>
      <div className="w-1/3 h-full flex justify-center items-center gap-10">
        <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
          <Home className="w-5 text-white" />
          <div className="bg-white rounded-full w-1 h-1"></div>
        </div>
        <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
          <MessageCircleMore className="w-5 text-white" />
          <div className="bg-white rounded-full w-1 h-1"></div>
        </div>
        <div className="w-fit h-fit flex flex-col justify-center items-center gap-1.5 cursor-pointer">
          <Bell className="w-5 text-white" />
          <div className="bg-white rounded-full w-1 h-1"></div>
        </div>
      </div>
      <div className="w-1/3 h-full flex justify-end items-center gap-6">
        <div className="w-40 p-1 h-fit flex justify-start gap-3 items-center rounded-md bg-zinc-700">
          <img
            className="w-8 h-8 rounded-full"
            src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
          />
          <span className="text-slate-100 text-sm font-semibold">Leon Arc</span>
          <ChevronDown className="cursor-pointer text-white w-4 ml-3" />
        </div>
      </div>
    </header>
  );
}
