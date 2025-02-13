import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/app/utils/routes";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const body = {
            email: credentials.email,
            password: credentials.password,
          };

          const response = await fetch(`${api}login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const res = await response.json();

          if (res.succeed) {
            if (res.payload.user.role === 30) {
              return {
                id: res.payload.user.id,
                email: res.payload.user.email,
                name: res.payload.user.organizationName,
                firstname: res.payload.user.firstname,
                lastname: res.payload.user.lastname,
                role: res.payload.user.role,
                accessToken: res.payload.accessToken,
                phone: res.payload.user.phone,
                profile: res.payload.user.profile,
                wallet: res.payload.user.wallet,
                organizationPhone: res.payload.user.organizationPhone,
                organizationName: res.payload.user.organizationName,
                organizationRegisterNumber:
                  res.payload.user.organizationRegisterNumber,
                position: res.payload.user.position,
              };
            } else {
              return {
                id: res.payload.user.id,
                email: res.payload.user.email,
                name:
                  res.payload.user.firstname + " " + res.payload.user.lastname,
                firstname: res.payload.user.firstname,
                lastname: res.payload.user.lastname,
                role: res.payload.user.role,
                accessToken: res.payload.accessToken,
                phone: res.payload.user.phone,
                profile: res.payload.user.profile,
                wallet: res.payload.user.wallet,
              };
            }
          }
          throw new Error(res.message);
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.phone = user.phone;
        token.profile = user.profile;
        token.wallet = user.wallet;
        if (user.role === 30) {
          token.organizationName = user.organizationName;
          token.organizationRegisterNumber = user.organizationRegisterNumber;
          token.organizationPhone = user.organizationPhone;
          token.position = user.position;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken;
      session.user.phone = token.phone;
      session.user.profile = token.profile;
      session.user.wallet = token.wallet;
      if (token.role === 30) {
        session.user.organizationName = token.organizationName;
        session.user.organizationRegisterNumber =
          token.organizationRegisterNumber;
        session.user.organizationPhone = token.organizationPhone;
        session.user.position = token.position;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
