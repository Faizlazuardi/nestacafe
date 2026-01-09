import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser } from "@/services/auth.service";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                name: { label: "name", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.name || !credentials.password) {
                return null;
                }
                
                const user = await authenticateUser(
                    credentials.name as string,
                    credentials.password as string
                );
                
                return {
                    id: String(user.id),
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.role = token.role as UserRole;
            }
            return session;
        }
    }
})
