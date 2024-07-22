import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "@/lib/dbConnect"
import { randomUUID } from "crypto"
import UserModel from "@/model/UserSchema"
import { generateOTP } from "../../sign-up/route"


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                console.log(credentials);
                
                const bcrypt = await require('bcryptjs');
                try {
                    const user = await UserModel.findOne(
                        {
                            email: credentials.identifier
                        }
                    )
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    if (bcrypt.compareSync(credentials.password, user.password))
                        return user;
                    else {
                        throw new Error("Incorrect Password")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            },
        }),
        Google,
        GitHub
    ], callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                try {
                    dbConnect()
                    const checkUser = await UserModel.findOne({
                        email: profile?.email
                    })
                    
                    
                    if (checkUser == null) {
                        const user = new UserModel(
                            {
                                name:profile?.name,
                                email: profile?.email,
                                password: randomUUID() as string,
                                verificationCode:generateOTP(),
                                verificationCodeExpiry:Date.now(),
                                isVerified: true,
                                image: profile?.picture
                            }
                        )
                        await user.save()
                    }
                    return true;
                } catch (error: any) {
                    throw new Error(error)
                }
            }
            return true;
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    }
})