import NavBar from "@/components/navbar/nav-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: Props) => {
  return (
    <div>
      <NavBar />
      <div className="max-w-450 w-full mx-auto p-1 md:p-2">{children}</div>
    </div>
  );
};

export default GlobalLayout;
