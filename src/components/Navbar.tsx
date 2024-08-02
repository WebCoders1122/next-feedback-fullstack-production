"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { MonitorCog, Moon, SunMoon } from "lucide-react";

import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  //handle darkmode
  const [darkMode, setDarkMode] = useState(false);
  const [systemDarkMode, setSystemDarkMode] = useState(true);

  //this is to get device dark or light mode
  const systemMode = window.matchMedia("(prefers-color-scheme: dark)");

  const handleDarkMode = () => {
    if (systemDarkMode) {
      darkMode == true ||
      (darkMode == false &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    } else {
      darkMode == true
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
    }
  };
  //to change system darkmode automatically
  systemMode.addEventListener("change", handleDarkMode);

  //to enable system darkmode
  useEffect(() => {
    handleDarkMode();
  }, [darkMode, systemDarkMode]);

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
                {systemDarkMode ? (
                  <MonitorCog className='h-5 w-5' />
                ) : darkMode ? (
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
                <DropdownMenuItem
                  onClick={() => {
                    setDarkMode(true);
                    setSystemDarkMode(false);
                  }}>
                  <Moon className='mr-2 h-4 w-4' />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDarkMode(false);
                    setSystemDarkMode(false);
                  }}>
                  <SunMoon className='mr-2 h-4 w-4' />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSystemDarkMode(true);
                    setDarkMode(false);
                  }}>
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
