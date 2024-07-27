import "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessages: string;
  }
  interface Session {
    user: {
      _id: string;
      username: string;
      email: string;
      isVerified: boolean;
      isAcceptingMessages: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessages: string;
  }
}

// this file is used to modify types of nextauth modules on requirement bases
