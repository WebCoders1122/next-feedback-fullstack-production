"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import H3 from "./ui/H3";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  console.log(session);

  return (
    <nav className='bg-card w-full border-b py-8 shadow flex justify-between items-center px-20 mx-auto'>
      <Link href='/'>
        <h2 className='font-bold text-2xl uppercase cursor-pointer'>
          Feedback App
        </h2>
      </Link>
      {session ? (
        <p className='text-xl font-medium'>Welcome {user.username}!</p>
      ) : null}
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
