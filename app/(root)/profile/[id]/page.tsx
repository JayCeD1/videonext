import React from "react";
import Header from "@/components/Header";

const Page = async ({ params }: ParamsWithSearch) => {
  const { id } = await params;
  return (
    <div className={"wrapper page"}>
      <Header
        title={"Okay | JayCe"}
        subHeader={"jesseeren@gmail.com"}
        userImg={"/assets/images/dummy.jpg"}
      />
      <h1 className={"text-2xl font-karla"}>{id}</h1>
    </div>
  );
};

export default Page;
