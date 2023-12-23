"use client";

import { useCallback, useState } from "react";
import { DropzoneState, useDropzone } from "react-dropzone";

import { UploadIcon } from "public/icons/uploadIcon";
import { FileIcon } from "public/icons/fileIcon";
import { CloseIcon } from "public/icons/closeIcon";

interface InputProps {
  dropzone: DropzoneState;
}

interface HasFileProps {
  file: File | null;
  removeFile: () => void;
}

const FileInput = () => {
  const [file, setFile] = useState<File | null>(null);

  const removeFile = useCallback(() => {
    setFile(null);
  }, [file]);

  const onDrop = useCallback((files: File[]) => {
    setFile(files[0]);
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
    },
  });

  return (
    <>
      {file ? (
        <HasFile file={file} removeFile={removeFile} />
      ) : (
        <Input dropzone={dropzone} />
      )}
    </>
  );
};

export default function Uploader() {
  const onSubimit = () => {};
  return (
    <div>
      <form
        onSubmit={onSubimit}
        className="w-full h-56 flex justify-center items-center"
      >
        <FileInput />
      </form>
    </div>
  );
}

const Input = ({ dropzone }: InputProps) => {
  const { getInputProps, getRootProps, isDragActive } = dropzone;
  return (
    <div
      {...getRootProps()}
      className={`min-w-[500px] bg-gray-700 h-full rounded-lg border-dashed border-4 hover:border-gray-500 hover:bg-gray-600 transition-all ${
        isDragActive ? "border-blue-500" : "border-gray-600"
      }`}
    >
      <label htmlFor="dropzone-file" className="cursor-pointer w-full h-full">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
          <UploadIcon
            className={`w-10 h-10 mb-3 ${
              isDragActive ? "text-blue-500" : "text-gray-500"
            }`}
          />
          {isDragActive ? (
            <p className="font-bold text-lg text-blue-400">
              Solte para adcionar
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-500 mb-2">
                <span className="font-bold">CLIQUE PARA ENVIAR</span> ou arraste
                até aqui.
              </p>
              <p className="text-gray-300 text-sm">PNG/JPG</p>
            </>
          )}
        </div>
      </label>
      <input {...getInputProps()} className="hidden" />
    </div>
  );
};

const HasFile = ({ file, removeFile }: HasFileProps) => {
  return (
    <div className="min-w-[500px] h-full rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 flex justify-center items-center">
      <div className="bg-white w-fit p-2 rounded-md shadow-md flex gap-3 items-center justify-center">
        <FileIcon />
        <span className="text-sm text-gray-500 my-4">{file?.name}</span>
        <button onClick={removeFile} type="button" className=" mt-1 p-1">
          <CloseIcon className="hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  );
};
