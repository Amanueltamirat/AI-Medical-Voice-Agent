
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDeailContest } from '@/context/UserDetailContext';

export type UserDetail={
  name:string,
  email:string,
  credits:number
}

function Provider({  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [userDetail, setUserDetail] = useState<any>()
  const { isSignedIn, user,isLoaded } = useUser();

  useEffect(()=>{

if (!isLoaded) {
      console.log("Clerk is still loading...");
      return;
    }
    console.log("Is signed in:", isSignedIn);
    console.log("User:", user);

    const callApi = async () => {
      if (!isSignedIn) {
        console.log("User is not signed in");
        return;
      }
      try {
        const result = await axios.post("/api/users", null, {
          withCredentials: true,
        });
        console.log("API response:", result.data);
        setUserDetail(result.data)
      } catch (error) {
        console.error("API error:", error);
      }
    };

    callApi();
    // CreateNewUser()
  },[isLoaded, isSignedIn, user])


 if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }
  return (
    <div>
    <UserDeailContest.Provider value={{userDetail,setUserDetail}}>

    {children}
    </UserDeailContest.Provider>
    </div>
  )
}

export default Provider