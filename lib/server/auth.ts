import User from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "../../shared/schema/register-schema";
import bcrypt from "bcryptjs";
import connectDB from "./mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const validate = loginSchema.safeParse({ email, password });

          if (!validate.success || validate.error) {
            throw new Error(validate.error.message);
          }

          // Check if email already exists
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("Invalid Credentials");
          }

          // check password
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id as string,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.log("Error logging in:", error);
          throw new Error("Error logging in");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "admin" | "customer" | "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },
};
