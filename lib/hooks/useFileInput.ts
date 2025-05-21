import { ChangeEvent, useRef, useState } from "react";

/**
 * Custom hook for handling file input operations with preview functionality
 *
 * @param maxSize - Maximum file size in bytes
 * @returns Object containing file state and methods
 *
 * What is useRef?
 * useRef is a React Hook that lets you reference a value that's not needed for rendering.
 *
 * In this hook, useRef is used to:
 * 1. Create a reference to the file input DOM element
 * 2. Persist the reference between renders (unlike regular variables that reset on each render)
 * 3. Access the input element directly to programmatically trigger clicks or other DOM operations
 * 4. Unlike useState, changing the .current property of a useRef object doesn't trigger a re-render
 *
 * The inputRef.current property points to the actual DOM node of the file input element,
 * allowing us to interact with it directly (like triggering a click event).
 */
export const useFileInput = (maxSize: number) => {
  // State to store the selected file
  const [file, setFile] = useState<File | null>();
  // State to store the preview URL for the file (image or video)
  const [previewUrl, setPreviewUrl] = useState<string | null>();
  // State to store video duration (only applicable for video files)
  const [duration, setDuration] = useState<number | null>();
  // Reference to the file input DOM element
  // This allows us to programmatically interact with the input element
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Handles file selection and validates file size
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Check if file size exceeds the maximum allowed size
    if (selectedFile.size > maxSize) {
      alert(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);

    // Create a preview URL for the file
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);

    // If it's a video file, calculate its duration
    if (selectedFile.type.includes("video")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = fileUrl;

      video.onloadedmetadata = () => {
        if (isFinite(video.duration) && video.duration > 0) {
          setDuration(Math.round(video.duration));
        } else {
          setDuration(0);
        }

        URL.revokeObjectURL(fileUrl);
      };
    }
  };

  /**
   * Resets the file input state
   */
  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setDuration(0);

    // Reset the file input value if the ref exists
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    file,
    previewUrl,
    duration,
    inputRef,
    handleFileChange,
    resetFile,
  };
};
