import { db } from "@/config/db";
import { openai } from "@/config/OpenAIModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT= `
  You are AI Medical Voice Agent that just had a voice conversation with a user. Based on doctor AI agent info and conversation between AI medical agent and user, generate a structured report with the following field:
  1. sessionId: a unique session identifier
  2. agent: the medical specialist name (eg.,"General Physician AI")
  3. user: name of the patient or "Anonymous" if not provided
  4. timestamp:current date and time in ISO format
  5. chiefComplaint: one-sentence of the main health concer 
  6: summary: a 2-3 sentence summery of the conversation, symptoms, and
  7: symptoms: list of symptoms mentioned by the user
  8: duration: how long the user has experienced the symptoms
  9: severity: mild, moderate, or severe
  10: medicationsMentioned: list of any medicines mentioned
  11: recommendations: list of AI suggetions (e.g., rest, see a doctor)
  Return the result in this JSON format:
  {
  "sessionID":"string",
  "agent":"string",
  "user":"string",
  "timestamp":"ISO Date string",
  "summary":"string",
  "symptoms":["symptom1", "symptom2"],
  "duration":"string",
  "severity":"string",
  "medicationsMentioned":["med1", "med2"],
  "recommendations":["rec1", "rec2"]
  }

  Only include valid fields. Respond with nothing else.
  

`

export async function POST(req:NextRequest){
    const {messages, sessionDetail, sessionId} = await req.json();

    try {

        const UserInput = "AI Doctor Agent Info:"+JSON.stringify(sessionDetail)+", Convesation:"+JSON.stringify(messages)
        
        const completion = await openai.chat.completions.create({
             model: "google/gemini-2.5-flash-lite",
            messages: [
                {role:"system", content:REPORT_GEN_PROMPT},
                { role: "user", content:UserInput }
                        ],
          })
        const newResp =  completion.choices[0].message
             //@ts-ignore
        const res = newResp.content.trim().replace('```json', '').replace('```', '')
        const JSONResp = JSON.parse(res)

        //Save to Db
        const result = await db.update(SessionChatTable).set({
            report:JSONResp,
            conversation:messages
        }).where(eq(SessionChatTable.sessionId, sessionId))
        return NextResponse.json(JSONResp)
  
    } catch (e) {
        return NextResponse.json(e)
    }   
}