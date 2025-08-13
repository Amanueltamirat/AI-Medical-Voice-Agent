import { openai } from "@/config/OpenAIModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
     //   google/gemini-2.5-flash-lite
     const {notes} = await req.json()
       try {
        
            const completion = await openai.chat.completions.create({
                model: "google/gemini-2.5-flash-lite",
                messages: [
                {role:"system", content:JSON.stringify(AIDoctorAgents)},
                { role: "user", content: "User Notes/Symptoms"+notes+", Depends on user notes and symptoms, please suggest list of doctors, Return objects in JSON only." }
                ],
  })
     const newResp =  completion.choices[0].message || ''
     //@ts-ignore
     const res = newResp.content.trim().replace('```json', '').replace('```', '')
     const JSONResp = JSON.parse(res)
     return NextResponse.json(JSONResp)
      
       } catch (e) {
        return NextResponse.json(e)
       }
}