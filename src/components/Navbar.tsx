"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import H3 from "./ui/H3";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  return (
    <nav className='bg-background w-full border-b py-8 shadow flex justify-between items-center px-20 mx-auto'>
      <Link href='/'>
        <h2 className='font-bold text-primary text-2xl uppercase cursor-pointer'>
          Feedback App
        </h2>
      </Link>
      {/* TODO: change it with session user username */}
      <p className='text-xl font-medium'>Welcome {"username"}!</p>
      {session ? (
        <Button onClick={() => signOut()}>Sign Out</Button>
      ) : (
        <Link href='/login'>
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  );
};
export default Navbar;
{
  /* <div className='min-h-screen flex flex-col items-center justify-center gap-5'>
          <H3>Please Login to Use Feedback App</H3>
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
        </div> */
}
