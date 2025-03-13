import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/app/utils/routes";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: "https://www.hire.mn/api/auth/callback/google",
        },
      },
    }),
    CredentialsProvider({
      id: "credentials",
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
    CredentialsProvider({
      id: "exam-token",
      name: "Exam Token",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          const tokenParts = credentials.token.split(".");
          const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");

          const pad = base64.length % 4;
          const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64;

          const decodedPayload = Buffer.from(paddedBase64, "base64").toString();
          const tokenData = JSON.parse(decodedPayload);

          if (!tokenData.result) {
            return null;
          }

          const userData = tokenData.result;

          return {
            id: userData.id,
            email: userData.email,
            name: `${userData.firstname} ${userData.lastname}`,
            firstname: userData.firstname,
            lastname: userData.lastname,
            role: userData.role || 20,
            accessToken: credentials.token,
            phone: userData.phone || null,
            profile: userData.profile || null,
            wallet: userData.wallet || 0,
          };
        } catch (error) {
          console.error("Token parse error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const response = await fetch(`${api}login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: profile.name,
              email: profile.email,
              profile: profile.picture,
              token: account.access_token,
            }),
          });

          const data = await response.json();
          if (data.succeed) {
            Object.assign(user, {
              id: data.payload.user.id,
              email: data.payload.user.email,
              name:
                data.payload.user.firstname + " " + data.payload.user.lastname,
              firstname: data.payload.user.firstname,
              lastname: data.payload.user.lastname,
              role: data.payload.user.role,
              accessToken: data.payload.accessToken,
              phone: data.payload.user.phone,
              profile: data.payload.user.profile,
              wallet: data.payload.user.wallet,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true;
    },
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
