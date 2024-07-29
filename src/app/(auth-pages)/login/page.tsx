"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className='bg-teal-700 rounded py-2 px-4 m-4'
        onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
