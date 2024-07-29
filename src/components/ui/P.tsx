import React from "react";

const P = ({ children }: { children: string }) => {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6 mx-2'>{children}</p>
  );
};
export default P;
