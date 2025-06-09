"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormField from "@/components/FormField";
import FileInput from "@/components/FileInput";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import {
  getThumbnailUploadUrl,
  getVideoUploadUrl,
  saveVideoDetails,
} from "@/lib/action/video";
import { useRouter } from "next/navigation";

const uploadFileToBunny = async (
  file: File,
  uploadUrl: string,
  accessKey: string,
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      AccessKey: accessKey,
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
};
const Page = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    visibility: Visibility;
  }>({
    title: "",
    description: "",
    visibility: "public",
  });

  const [duration, setDuration] = useState(0);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Initialize useFileInput hooks for video and thumbnail
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  useEffect(() => {
    if (video.duration != null || 0) {
      setDuration(video.duration);
    }
  }, [video.duration]);

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;

        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        //create file
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          //simulating user change event
          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);

          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }
        if (duration) setDuration(duration);

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (error) {
        console.log("Error checking for recorded video", error);
      }
    };
    checkForRecordedVideo();
  }, [video]);

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
      //get video upload url
      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey,
      } = await getVideoUploadUrl();

      if (!videoUploadUrl || !videoAccessKey)
        throw new Error("Failed to get video upload URL");
      //upload to bunny
      await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);
      //upload thumbnail to DB
      const {
        cdnUrl: thumbnailCdnUrl,
        uploadUrl: thumbnailUploadUrl,
        accessKey: thumbnailAccessKey,
      } = await getThumbnailUploadUrl(videoId);

      if (!thumbnailCdnUrl || !thumbnailUploadUrl || !thumbnailAccessKey)
        throw new Error("Failed to get thumbnail upload URL");
      //attach thumbnail
      await uploadFileToBunny(
        thumbnail.file,
        thumbnailUploadUrl,
        thumbnailAccessKey,
      );
      //create new db entry for video metadata details (urls,data)
      await saveVideoDetails({
        ...formData,
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        duration: duration,
      });

      router.push(`/video/${id}`);
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
        onSubmit={handleSubmit}
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
