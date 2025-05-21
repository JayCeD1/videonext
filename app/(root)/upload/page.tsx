"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import FormField from "@/components/FormField";
import FileInput from "@/components/FileInput";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";

const Page = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  });

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize useFileInput hooks for video and thumbnail
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!video.file || !thumbnail.file) {
        setError("Please upload both video and thumbnail files");
        return;
      }
      if (!formData.title || !formData.description) {
        setError("Please fill in the details");
        return;
      }
      //upload to bunny
      //upload thumbnail to DB
      //attach thumbnail
      //create new db entry for video metadata details (urls,data)
    } catch (error) {
      console.log("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={"wrapper-md upload-page"}>
      <h1>Upload a video</h1>
      {error && <div className="error-field">{error}</div>}
      <form
        className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
        onSubmit={}
      >
        <FormField
          id={"title"}
          label={"Title"}
          value={formData.title}
          onChange={handleInputChange}
          placeholder={"Enter a clear and concise video title"}
        />
        <FormField
          id={"description"}
          label={"Description"}
          value={formData.description}
          onChange={handleInputChange}
          placeholder={"Describe your video in detail"}
          as={"textarea"}
        />
        <FileInput
          id={"video"}
          label={"Video"}
          accept={"video/*"}
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type={"video"}
        />
        <FileInput
          id={"thumbnail"}
          label={"Thumbnail"}
          accept={"image/*"}
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type={"image"}
        />
        <FormField
          id={"visibility"}
          label={"Visibility"}
          value={formData.visibility}
          onChange={handleInputChange}
          as={"select"}
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
        />
        <button
          type={"submit"}
          disabled={isSubmitting}
          className={"submit-button"}
        >
          {isSubmitting ? "Uploading..." : "Upload video"}
        </button>
      </form>
    </div>
  );
};

export default Page;
