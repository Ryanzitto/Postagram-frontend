import { ErroSVG } from "public/icons/ErroSVG";
import { OkaySVG } from "public/icons/OkaySVG";

export const Modal = (props: { text: string; status: string }) => {
  const { text, status } = props;
  return (
    <div className="z-30 w-full h-full absolute flex justify-center items-center">
      <div className="w-[300px] h-[150px] text-center p-4 bg-white border border-slate-300 rounded-md flex flex-col justify-center items-center gap-3">
        <p className={`font-bold text-gray-500`}>{text}</p>
        {status === "success" && <OkaySVG />}
        {status === "error" && <ErroSVG />}
      </div>
    </div>
  );
};
