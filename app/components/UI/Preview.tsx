import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "app/zodSchema/createPost";
import { useState } from "react";
import { useStore } from "app/store";
import { useRouter } from "next/navigation";
import {
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Smile,
} from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

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

  const { user, logout } = useStore();

  const router = useRouter();

  const [textAlign, setTextAlign] = useState<string>("text-left");

  const [subjectIsHovered, setSubjectIsHovered] = useState<boolean>(false);

  const handleSelectTextColor = (color: textColors) => {
    setTextColorSelected(color);
  };

  const handleSelectBgColor = (bgColor: string) => {
    setBgColorSelected(bgColor);
  };

  async function onSubmit(dataForm: FormData) {
    const data = {
      subject: dataForm.subject,
      text: content,
      bgColor: bgColorSelected,
      textColor: textColorSelected.textColor,
      textAlign: textAlign,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
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
        if (error.response.data.message === "Token has expired") {
          toast.error("Your session expired, please login to continue.");
          logout();
          router.push("/auth/signIn");
          if (closeButtonModalRef?.current) {
            closeButtonModalRef.current.click();
          }
          return;
        }
        if (closeButtonModalRef?.current) {
          closeButtonModalRef.current.click();
          toast.error("an Error occured");
        }
      });
  }

  const [showPickerEmoji, setShowPickerEmoji] = useState<boolean>(false);

  const addEmoji = (e: any) => {
    const sym = e.unified.split("_");
    const codeArray: any[] = [];
    sym.forEach((element: string) => codeArray.push("0x" + element));
    let emoji = String.fromCodePoint(...codeArray);

    // Obtém a posição do cursor
    const textarea = document.getElementById("text") as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;

    // Divide o conteúdo do textarea em duas partes em torno da posição do cursor
    const start = content?.substring(0, cursorPosition);
    const end = content?.substring(cursorPosition);

    // Atualiza o conteúdo inserindo o emoji entre as duas partes
    setContent(start + emoji + end);
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="w-full h-fit flex">
        <div className="w-1/2 h-fit flex flex-col gap-4">
          <div className="w-full h-fit flex flex-col gap-2">
            <span className="text-white/50 text-xs">BG Color:</span>
            <div className="flex gap-1 sm:gap-2">
              {colors.map((color) => {
                return (
                  <button
                    key={color}
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
          <div className="w-full h-fit flex flex-col gap-2">
            <span className="text-white/50 text-xs">Text Color:</span>
            <div className="flex gap-1 sm:gap-2">
              {textColors.map((color) => {
                return (
                  <button
                    key={color.textColor}
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
        </div>
        <div className="w-1/2 h-full flex justify-center gap-4 pt-8">
          <div
            onClick={() => setTextAlign("text-left")}
            className={`${
              textAlign === "text-left" ? "bg-zinc-900" : " bg-zinc-700/50"
            } w-fit h-fit p-2 rounded-md flex justify-center items-center cursor-pointer transition-all`}
          >
            <AlignStartVertical className="text-white/80 w-4 h-4" />
          </div>
          <div
            onClick={() => setTextAlign("text-center")}
            className={`${
              textAlign === "text-center" ? "bg-zinc-900" : " bg-zinc-700/50"
            } w-fit h-fit p-2 rounded-md flex justify-center items-center cursor-pointer transition-all`}
          >
            <AlignCenterVertical className="text-white/80 w-4 h-4" />
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col justify-between gap-0"
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
        <div className={`rounded-md w-full h-fit flex ${bgColorSelected} mt-4`}>
          <textarea
            placeholder="Write something here."
            {...register("text", { required: true })}
            id="text"
            name="text"
            value={content !== null ? content : ""}
            className={`${textColorSelected.textColor} ${textAlign} break-words bg-transparent font-medium  text-xl w-full h-full outline-none resize-none p-6`}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input
            className="hidden"
            {...register("bgColor", { required: true })}
            id="bgColor"
            name="bgColor"
            type="text "
          />
          <input
            className="hidden"
            {...register("textColor", { required: true })}
            id="textColor"
            name="textColor"
            type="text "
          />
          <input
            className="hidden"
            {...register("textAlign", { required: true })}
            id="textAlign"
            name="textAlign"
            type="text"
            value={textAlign}
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
          {errors.textAlign && (
            <p className="text-red-600 text-xs pt-2">
              {errors?.textAlign?.message}
            </p>
          )}
        </div>
        <div className="hidden lg:flex w-full h-fit justify-end mt-2">
          <Smile
            onClick={() => setShowPickerEmoji(!showPickerEmoji)}
            className="text-white/50 text-xs cursor-pointer transition-all hover:text-white/20"
          />

          {showPickerEmoji && (
            <div className="absolute top-0 -right-[310px]">
              <Picker
                previewPosition={"none"}
                emojiSize={20}
                emojiButtonSize={30}
                data={data}
                onEmojiSelect={addEmoji}
              />
            </div>
          )}
        </div>
        <div className="w-full h-fit mt-4">
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
