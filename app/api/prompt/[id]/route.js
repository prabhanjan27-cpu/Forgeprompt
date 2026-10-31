import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

//GET(read)
export const GET=async(request,{params})=>{
    try {
        await connectToDB()
        const {id}= await params
        const prompt=await Prompt.findById(id).populate('creator')
        if(!prompt){
            return new Response("prompt Not Found!",{status:404})
        }
        return new Response(JSON.stringify(prompt),{
           status:200 
        })
    } catch (error) {
        return new Response("Failed to fetch all prompts",{
           status:500 
        })
    }
}

//PATCH(update)
export const PATCH=async(request,{params})=>{
    const {prompt,tag}=await request.json()
    try {
        await connectToDB()
        const {id}=await params
        const existingPrompt=await Prompt.findById(id)
        if(!prompt){
            return new Response("prompt Not Found!",{status:404})
        }
        existingPrompt.prompt=prompt
        existingPrompt.tag=tag
        
        await existingPrompt.save()

        return new Response(JSON.stringify(existingPrompt),{
           status:200 })
    } catch (error) {
         return new Response("Failed to update prompt",{
           status:500 
        })
    }
}

//DELETE(delete)
export const DELETE=async(request,{params})=>{
    try {
        await connectToDB()
        const {id}=await params
        const deletePrompt=await Prompt.findByIdAndDelete(id)
        if(!deletePrompt){
            return new Response("Prompt Not Found!",{
                status:404
            })
        }
        return new Response("prompt deleted successfully",{
           status:200 })

    } catch (error) {
         return new Response("Failed to delete prompt",{
           status:500 
        })
    }
}