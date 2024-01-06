import { ErroSVG } from "public/icons/ErroSVG";
import { OkaySVG } from "public/icons/OkaySVG";

import { motion } from "framer-motion";

export const Modal = (props: { text: string; status: string }) => {
  const { text, status } = props;
  const styleOK =
    "bg-gradient-to-r from-green-400 via-green-500 to-green-600 background-animate";
  const styleError =
    "bg-gradient-to-r from-red-400 via-red-500 to-red-600 background-animate";
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
      transition={{
        duration: 0.2,
        delay: 0,
      }}
      className="z-30 w-full h-full absolute flex justify-center items-center"
    >
      <div
        className={`w-[300px] h-[150px] ${
          status === "success" ? styleOK : styleError
        } rounded-md flex justify-end items-center`}
      >
        <div className="w-[292px] h-[150px] text-center bg-white rounded-r-md border border-slate-300 flex flex-col  gap-3 justify-center items-center">
          <p className={`font-bold text-gray-500`}>{text}</p>
          {status === "success" && <OkaySVG />}
          {status === "error" && <ErroSVG />}
        </div>
      </div>
    </motion.div>
  );
};
