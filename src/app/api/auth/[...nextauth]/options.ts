// making nextauth.js login options page with credentials

import dbConnet from "@/lib/dbConnect";
import User from "@/model/UserModel";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      // these credentials will provide values from user and also make html form
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Input your email here",
        },
        password: { label: "Password", type: "password" },
        //TODO: add any custom properties here and check if it works
      },
      //this used to connect DB, find user from DB and return user
      async authorize(credentials: any): Promise<any> {
        //connect DB
        await dbConnet();
        try {
          //find user from mongoDB
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          //checking user details
          if (!user) throw new Error("User not found");
          if (!user.isVerified) throw new Error("User not verified");
          const isTruePassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isTruePassword) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error: any) {
          console.log(error, "Error while authorizing user");
          throw new Error(error);
        }
      },
    }),
    // more providers can be listed here
  ],
  //callback section for next auth
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  // session stretagy
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // secret key
  secret: process.env.NEXTAUTH_SECRET,
  // pages to implement these options
  pages: {
    signIn: "/login",
  },
};
