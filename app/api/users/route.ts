import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Add CORS headers
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");


  console.log('API route /api/users hit');
  // console.log("Request headers:", Object.fromEntries(req.headers)); // Log cookies

  const user = await currentUser();

  console.log("Current user:", user);

  if (!user) {
    console.log("No authenticated user found");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await db
      .select()
      .from(usersTable)
      // @ts-ignore
      .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress));

    console.log('Users found:', users);

    if (users.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
         // @ts-ignore
          name: user.primaryEmailAddressId,
          email: user.emailAddresses?.find((email)=> email.emailAddress)?.emailAddress,
         creadit: 10,   //  Note: Check if "creadit" is a typo; should it be "credit"?
         // @ts-ignore
        })
        .returning({usersTable});
      return NextResponse.json(result[0]?.usersTable);
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error in /api/users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}