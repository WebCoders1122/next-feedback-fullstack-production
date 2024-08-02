"use client";

import { MonitorCog, Moon, SunMoon } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  //handle darkmode
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    darkMode == true
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  };
  const handleSystemDarkMode = () => {
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)");
    systemMode.matches ? setDarkMode(true) : setDarkMode(false);
    systemMode.addEventListener("change", (e) => {
      e.matches ? setDarkMode(true) : setDarkMode(false);
    });
  };

  //to enable system darkmode
  useEffect(() => {
    handleDarkMode();
  }, [darkMode]);

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
        <div className='flex gap-5 items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className='p-2'
                variant='outline'
                size='flexible'>
                {darkMode ? (
                  <SunMoon className='h-5 w-5' />
                ) : (
                  <Moon className='h-5 w-5' />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-36'
              align='start'>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setDarkMode(false)}>
                  <SunMoon className='mr-2 h-4 w-4' />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDarkMode(true)}>
                  <Moon className='mr-2 h-4 w-4' />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSystemDarkMode}>
                  <MonitorCog className='mr-2 h-4 w-4' />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <SunMoon />
          <Link href='/login'>
            <Button>Login</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
