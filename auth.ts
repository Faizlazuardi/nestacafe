import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser } from "@/services/auth.service";

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
                    id: user.id.toString(),
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role as any;
            }
            return session;
        }
    }
})
