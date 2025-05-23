"use server";

import { apiFetch, getEnv, withErrorHandling } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BUNNY } from "@/constants";
import { k12 } from "@noble/hashes/sha3-addons";

const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID");
const ACCESS_KEYS = {
  streamAccessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
  storageAccessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY"),
};

//Helper functions
const getSessionUserId = async (): Promise<string> => {
  // Simulate fetching the user ID from a session or database
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthenticated");
  }

  return session.user.id;
};

//Server actions
export const getVideoUploadUrl = withErrorHandling(async () => {
  const userId = await getSessionUserId();

  const videoResponse = await apiFetch(
    `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
    {
      method: "POST",
      bunnyType: "stream",
      body: {
        title: "Video Title",
        collectionId: "",
      },
    },
  );

  const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;

  return {
    videoId: videoResponse.guid,
    uploadUrl,
    acessKey: ACCESS_KEYS.streamAccessKey,
  };
});

export const getThumbnailUploadUrl = withErrorHandling(
  async (videoId: string) => {
    const fileName = `${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${fileName}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${fileName}`;

    return {
      uploadUrl,
      cdnUrl,
      accessKey: ACCESS_KEYS.storageAccessKey,
    };
  },
);

export const saveVideoDetails = withErrorHandling(
  async (videoDetails: VideoDetails) => {},
);
