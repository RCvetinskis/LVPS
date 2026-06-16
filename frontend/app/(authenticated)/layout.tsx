import NavBar from "@/components/navbar/nav-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: Props) => {
  return (
    <div className="relative">
      <NavBar />
      <div className=" p-1 mt-10 md:p-2">{children}</div>
    </div>
  );
};

export default GlobalLayout;
