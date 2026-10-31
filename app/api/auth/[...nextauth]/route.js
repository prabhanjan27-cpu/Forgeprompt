import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import {connectToDB} from "@utils/database"
import User from "@models/user"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks:{  
    async session({session}){
    if (!session.user?.email) return session

    await connectToDB()

    const sessionUser=await User.findOne({
      email:session.user.email
    })
    if (sessionUser) session.user.id=sessionUser._id.toString()
    return session

  },
  async signIn({profile}){
    try{
      await connectToDB()
      if (!profile?.email) return false

      //check if user already exist 
      const userExist=await User.findOne({
        email:profile.email})
      
      // if not create new user
      if(!userExist){
        const username = (profile.name || profile.email.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .padEnd(8, "0")
          .slice(0, 20)

        await User.create({
          email:profile.email,
          username,
          image:profile.picture,
        })
      }

      return true
    }
    catch(error){
      console.error("Google sign-in failed while checking or saving the user:", error)
      return false

    }

  }},
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
