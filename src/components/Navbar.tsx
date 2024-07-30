"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import H3 from "./ui/H3";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  //   if (!session) {
  //     return (

  //     );
  //   }
  return (
    <>
      {/* TODO: change it to "session" instead of "!session" */}
      {!session ? (
        <div className='bg-slate-50 border-b p-5 shadow flex justify-around items-center'>
          <Link href='/'>
            <h2 className='font-bold text-primary text-2xl uppercase cursor-pointer'>
              Feedback App
            </h2>
          </Link>
          {/* TODO: change it with session user username */}
          <p>Welcome {"username"}!</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div className='min-h-screen flex flex-col items-center justify-center gap-5'>
          <H3>Please Login to Use Feedback App</H3>
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
        </div>
      )}
    </>
  );
};
export default Navbar;
