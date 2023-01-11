import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { CognitoUserPool, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js'

type User = {
    id: string,
    email: string,
    name: string,
    emailVerified: boolean,
    data: {
        token: string,
        refreshToken: string,
    }
}

const userPool = new CognitoUserPool({
    ClientId: env.COGNITO_CLIENT_ID,
    UserPoolId: env.COGNITO_USER_POOL
})

export const authOptions: NextAuthOptions = {
    callbacks: {
        session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
        async jwt({token,user}){
            if(user){
                token.id = user.id;
                token.user = user;
            }
            return token;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            credentials: {
                username: {
                    label: "username",
                    type: "text",
                },
                password: {
                    label: "password",
                    type: "password"
                },
            },
            async authorize(credentials, _){
                if(!credentials){
                    return null;
                }
               const authDetails = new AuthenticationDetails({
                Username: credentials.username,
                Password: credentials.password
               });

               const user = new CognitoUser({
                Username: credentials.username,
                Pool: userPool,
               });

               const authenticatedUser = await new Promise<User | null>(resolve => {
                user.authenticateUser(authDetails, {
                    onSuccess(session, _) {
                        const { sub: id, email_verified: emailVerified, email, ...restPayload  } = session.getIdToken().payload;
                        const user = {
                            id,
                            emailVerified,
                            email,
                            name: restPayload['cognito:username'],
                            data: {
                                token: session.getAccessToken().getJwtToken(),
                                refreshToken: session.getRefreshToken().getToken(),
                            }
                        }
                        resolve(user);
                    },
                    onFailure(err) {
                        resolve(null);
                    },
                    }) 
                });
                return authenticatedUser;
            }
        }),
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET, 
        }),
    ],
};

export default NextAuth(authOptions);