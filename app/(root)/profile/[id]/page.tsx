import React from "react";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { getAllVideosByUser } from "@/lib/action/video";
import { redirect } from "next/navigation";
import EmptyState from "@/components/EmptyState";

const Page = async ({ params, searchParams }: ParamsWithSearch) => {
  const { id } = await params;
  const { query, filter } = await searchParams;

  const { user, videos } = await getAllVideosByUser(id, query, filter);

  if (!user) redirect("/404");

  return (
    <div className={"wrapper page"}>
      <Header
        title={user?.name}
        subHeader={user?.email}
        userImg={user?.image ?? ""}
      />
      {videos?.length > 0 ? (
        <section className={"video-grid"}>
          {videos.map(({ video, user }) => (
            <VideoCard
              key={video.videoId}
              {...video}
              thumbnail={video.thumbnailUrl}
              userImg={user?.image ?? ""}
              username={user?.name ?? "Guest"}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={"/assets/icons/video.svg"}
          title={"No videos yet"}
          description={"videos will show once you upload one"}
        />
      )}
    </div>
  );
};

export default Page;
