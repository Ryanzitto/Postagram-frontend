import { MoreHorizontal } from "lucide-react";

export default function Aside() {
  return (
    <div className="w-[25%] flex h-full p-6">
      <div className="relative w-[90%] h-2/3 bg-zinc-700 rounded-md ">
        <div className="absolute w-full h-full flex justify-center items-center">
          <div className="w-20 h-20 p-1 bg-zinc-700 rounded-md self-center justify-self-center mb-24">
            <img
              className="rounded-md"
              src="https://img.wattpad.com/0145c2f3f751ec26ef0203b2f3b813886cebe603/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f4e6a494e634a6d4d4d65394135773d3d2d3832373438383335392e313565396138356134313734636231343436393538343136303132312e6a7067?s=fit&w=720&h=720"
            />
          </div>
        </div>
        <div className="bg-purple-500 w-full h-1/3 rounded-t-md flex justify-end items-start pt-4 pr-4">
          <div className="rounded-md w-6 h-6 bg-zinc-800/80 p-1 flex justify-center items-center">
            <MoreHorizontal className="cursor-pointer text-white w-4 rotate-90 flex" />
          </div>
        </div>
        <div className="w-full h-2/3 rounded-b-md flex flex-col items-center">
          <div className="w-full flex h-fit p-1 justify-between">
            <div className="w-20 flex flex-col text-center">
              <span className="text-sm text-white font-semibold">415</span>
              <span className="text-xs text-white/50 font-normal">
                Followers
              </span>
            </div>
            <div className="w-20 flex flex-col text-center">
              <span className="text-sm text-white font-semibold">415</span>
              <span className="text-xs text-white/50 font-normal">
                Following
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center h-fit p-1 mt-2">
            <span className="text-md text-white font-semibold">Leon Arc</span>
            <span className="text-xs text-white/50 font-normal">@Leon77</span>
          </div>
          <div className="w-[90%] h-[1px] bg-zinc-800/30 mt-4 mb-4"></div>
          <div className="w-full flex justify-center items-center text-center h-fit px-3 py-2">
            <span className="text-sm text-white/80 font-normal">
              Hi, Im Leon Arc and I love this App. 🛸👽
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
