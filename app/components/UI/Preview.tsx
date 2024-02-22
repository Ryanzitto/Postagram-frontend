import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "app/zodSchema/createPost";
import { useState } from "react";

type FormData = z.infer<typeof createPostSchema>;

interface textColors {
  textColor: string;
  bgColor: string;
}

const colors = [
  "bg-white",
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-black",
];

const textColors = [
  { textColor: "text-white", bgColor: "bg-white" },
  { textColor: "text-red-500", bgColor: "bg-red-500" },
  { textColor: "text-yellow-500", bgColor: "bg-yellow-500" },
  { textColor: "text-blue-500", bgColor: "bg-blue-500" },
  { textColor: "text-purple-500", bgColor: "bg-purple-500" },
  { textColor: "text-amber-500", bgColor: "bg-amber-500" },
  { textColor: "text-emerald-500", bgColor: "bg-emerald-500" },
  { textColor: "text-black", bgColor: "bg-black" },
];

interface Props {
  textColorSelected: {
    textColor: string;
    bgColor: string;
  };
  bgColorSelected: string;
  content: string | null;
  setContent: (arg: string) => void;
  setBgColorSelected: (bg: string) => void;
  setTextColorSelected: (color: { bgColor: string; textColor: string }) => void;
  closeButtonModalRef: React.RefObject<HTMLSpanElement>;
  fetchPosts: () => void;
}

export default function Preview({
  fetchPosts,
  closeButtonModalRef,
  textColorSelected,
  bgColorSelected,
  content,
  setContent,
  setBgColorSelected,
  setTextColorSelected,
}: Props) {
  const URL = process.env.NEXT_PUBLIC_BASEURL;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createPostSchema),
  });

  const [subjectIsHovered, setSubjectIsHovered] = useState<boolean>(false);

  const handleSelectTextColor = (color: textColors) => {
    setTextColorSelected(color);
  };

  const handleSelectBgColor = (bgColor: string) => {
    setBgColorSelected(bgColor);
  };

  async function onSubmit() {
    const data = {
      subject: "teste",
      text: content,
      bgColor: bgColorSelected,
      textColor: textColorSelected.textColor,
    };

    const config = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDNlODE4MTZlNGVlNzkyNzA5OGE2ZCIsImlhdCI6MTcwODY0MTU5NCwiZXhwIjoxNzA4NzI3OTk0fQ.ViXkDms2X_cniR3Fgcn3Sf-RgXc96J9xcmLbX49jPCw`,
      },
    };

    axios
      .post(`${URL}/post/`, data, config)
      .then((response) => {
        console.log(response);
        if (closeButtonModalRef?.current) {
          closeButtonModalRef.current.click();
          toast.success("Post created!");
          setContent("");
        }
        fetchPosts();
      })
      .catch((error) => {
        console.log(error);
        if (closeButtonModalRef?.current) {
          closeButtonModalRef.current.click();
          toast.error("an Error occured");
        }
      });
  }

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="w-full h-fit flex flex-col gap-2">
        <span className="text-white/50 text-xs">BG Color:</span>
        <div className="flex gap-2">
          {colors.map((color) => {
            return (
              <button
                disabled={color === textColorSelected.bgColor}
                onClick={() => handleSelectBgColor(color)}
                className={`disabled:cursor-not-allowed cursor-pointer rounded-full w-4 h-4 ${color} ${
                  bgColorSelected === color ? "border-2 border-white" : null
                }`}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-2 w-full h-fit flex flex-col gap-2">
        <span className="text-white/50 text-xs">Text Color:</span>
        <div className="flex gap-2">
          {textColors.map((color) => {
            return (
              <button
                disabled={color.bgColor === bgColorSelected}
                onClick={() => handleSelectTextColor(color)}
                className={`disabled:cursor-not-allowed  cursor-pointer rounded-full w-4 h-4 ${
                  color.bgColor
                } ${
                  textColorSelected.textColor === color.textColor
                    ? "border-2 border-white"
                    : null
                }`}
              />
            );
          })}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between gap-4"
      >
        <div className="mt-6 w-full h-fit py-2 flex flex-col">
          <label className="text-xs text-white/50">Subject:</label>
          <input
            onMouseEnter={() => setSubjectIsHovered(true)}
            onMouseLeave={() => setSubjectIsHovered(false)}
            className="pt-2 outline-none bg-none bg-transparent text-sm text-white/50 pl-2"
            {...register("subject", { required: true })}
            id="subject"
            name="subject"
            type="subject "
          />
          <div className="h-[0.5px] w-full bg-zinc-700/50 mt-1">
            <div
              className={`transition-all h-full  bg-zinc-600 ${
                subjectIsHovered ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          {errors.subject && (
            <p className="text-red-600 text-xs pt-2">
              {errors?.subject?.message}
            </p>
          )}
        </div>
        <div className={`rounded-md w-full h-fit flex ${bgColorSelected}`}>
          <textarea
            {...register("text", { required: true })}
            id="text"
            name="text"
            className={`${textColorSelected.textColor} break-words bg-transparent font-medium  text-xl w-full h-full outline-none resize-none p-6`}
            value={content !== null ? content : ""}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            className="hidden"
            {...register("bgColor", { required: true })}
            id="bgColor"
            name="bgColor"
            type="bgColor "
          />
          <input
            className="hidden"
            {...register("textColor", { required: true })}
            id="subtextColorject"
            name="textColor"
            type="textColor "
          />
        </div>
        <div className="w-full h-fit flex flex-col gap-1">
          {errors.text && (
            <p className="text-red-600 text-xs pt-2">{errors?.text?.message}</p>
          )}
          {errors.bgColor && (
            <p className="text-red-600 text-xs pt-2">
              {errors?.bgColor?.message}
            </p>
          )}
          {errors.textColor && (
            <p className="text-red-600 text-xs pt-2">
              {errors?.textColor?.message}
            </p>
          )}
        </div>
        <div className="w-full h-fit">
          <button
            type="submit"
            className="w-full p-2 bg-purple-500 rounded-md transition-all text-white hover:bg-purple-500/80"
          >
            <span className="font-bold text-lg transition-all ">Create</span>
          </button>
        </div>
      </form>
    </div>
  );
}
