// "use client"

import { SignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {

const user = await currentUser();

// if (user) {
//     redirect("/"); // Replace with your desired URL
//   }

  return (
    <div className='flex items-center justify-center h-screen'>
  <SignIn />
    </div>
  ) 
}