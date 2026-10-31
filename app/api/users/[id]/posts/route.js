import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const GET=async(request,{params})=>{
    try {
        await connectToDB()
        const { id } = await params
        if (!id){
            throw new Error("Login")
        }
        const prompts=await Prompt.find({
            creator:id
        }).populate('creator').sort({_id:-1})
        return new Response(JSON.stringify(prompts),{
           status:200 
        })
    } catch (error) {
        return new Response("Failed to fetch all prompts",{
           status:500 
        })
    }
}
