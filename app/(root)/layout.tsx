import React from "react";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

export default Layout;
