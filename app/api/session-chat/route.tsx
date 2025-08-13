import { db } from '@/config/db';
import { desc, eq } from 'drizzle-orm'
import { SessionChatTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import {v4 as uuidvd} from 'uuid';

export async function POST(req:NextRequest) {

    const {notes, selectedDoctor} = await req.json()

    try {
        const user = await currentUser();
        const sessionId = uuidvd()
        const result = await db.insert(SessionChatTable).values({
            sessionId: sessionId,
            notes:notes,
            selectedDoctor:selectedDoctor,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdOn:(new Date()).toString(),
            //   conversation:JSON.stringify([]),
            // report:JSON.stringify([]), 
            // @ts-ignore
        }).returning({SessionChatTable})  

        return NextResponse.json(result[0]?.SessionChatTable) 
    } catch (e) {
       return NextResponse.json(e)
    }


}

export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url);

    const sessionId = searchParams.get('sessionId');

    const user = await currentUser();

  if(sessionId == 'all'){
      const result = await db
    .select()
    .from(SessionChatTable)
    // @ts-ignore
    .where(eq(SessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(SessionChatTable.id))
   
     return NextResponse.json(result)

  } else {
      const result = await db
    .select()
    .from(SessionChatTable)
    // @ts-ignore
    .where(eq(SessionChatTable.sessionId, sessionId))
   

return NextResponse.json(result[0])

  }
}