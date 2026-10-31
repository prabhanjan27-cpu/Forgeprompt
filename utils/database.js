import mongoose from "mongoose";
import { setServers } from "node:dns";

const cached = globalThis.mongooseCache ??= { conn: null, promise: null }

export const connectToDB=async()=>{
    mongoose.set('strictQuery',true)
    if (mongoose.connection.readyState === 1) return mongoose
    if (cached.promise) return cached.promise

    try {
        const dnsServers = process.env.MONGODB_DNS_SERVERS
            ?.split(",")
            .map((server) => server.trim())
            .filter(Boolean)

        if (dnsServers?.length) setServers(dnsServers)

        cached.promise = mongoose.connect(process.env.MONGODB_URI,{
            dbName:"shere_prompt",
        })
        cached.conn = await cached.promise
        console.log("MongoDB connected")
        return cached.conn
    } catch (error) {
        cached.promise = null
        cached.conn = null
        console.error("MongoDB connection failed:", error)
        throw error
    }
}       
