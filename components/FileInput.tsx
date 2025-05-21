import React, { ChangeEvent, RefObject } from "react";
import Image from "next/image";

/**
 * Props for the FileInput component
 */
type FileInputProps = {
  id: string;
  label: string;
  accept: string;
  file?: File;
  previewUrl?: string;
  inputRef: RefObject<HTMLInputElement>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  type: "video" | "image";
};

const FileInput = ({
  id,
  label,
  accept,
  file,
  previewUrl,
  inputRef,
  onChange,
  onReset,
  type,
}: FileInputProps) => {
  return (
    <section className={"file-input"}>
      <label htmlFor={id}>{label}</label>
      <input
        type={"file"}
        id={id}
        accept={accept}
        ref={inputRef}
        hidden
        onChange={onChange}
      />
      {!previewUrl ? (
        <figure onClick={() => inputRef.current.click()}>
          <Image
            src={"/assets/icons/upload.svg"}
            alt={"upload"}
            width={24}
            height={24}
          />
          <p>Click to upload your {id}</p>
        </figure>
      ) : (
        <div>
          {type === "video" ? (
            <video src={previewUrl} controls />
          ) : (
            <Image src={previewUrl} alt={"image"} fill />
          )}
          <button type={"button"} onClick={onReset}>
            <Image
              src={"/assets/icons/close.svg"}
              alt={"close"}
              width={16}
              height={16}
            />{" "}
          </button>
          <p>{file?.name}</p>
        </div>
      )}
    </section>
  );
};

export default FileInput;
