import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { SigninSchema } from "@/lib/validation";
import client from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "joe@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = SigninSchema.safeParse(credentials);
        if (!parsed.success) throw new Error("Invalid input format");

        const { username, password } = parsed.data;

        const user = await client.user.findFirst({
          where: { email: username },
        });
        if (!user) throw new Error("User does not exist");

        const isValid = user.password === password;
        if (!isValid) throw new Error("Invalid password");

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
