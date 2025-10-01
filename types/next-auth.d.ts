import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "customer" | "user";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "admin" | "customer" | "user";
  }
}
