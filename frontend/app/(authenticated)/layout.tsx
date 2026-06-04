import React from "react";

type Props = {
  children: React.ReactNode;
};

const GlobalLayout = ({ children }: Props) => {
  return <div className="max-w-450 w-full mx-auto p-1 md:p-2">{children}</div>;
};

export default GlobalLayout;
