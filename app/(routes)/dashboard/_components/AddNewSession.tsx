"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

function AddNewSession({hitoryListRecord}:any) {
 
 const [loading, setLoading] = useState(false)
 const [note, setNote] = useState<string>()
 const [suggestedDoctors, setSuggestedDoctos] = useState <doctorAgent>()
 const [selectedDoctor,setSelectedDoctor] = useState <doctorAgent>()
  

   const {has} = useAuth();
  
    //@ts-ignore
    const paidUser = has && has({
      plan:'pro'
    })

const router = useRouter()

const OnClickNext = async()=>{
  setLoading(true)
  const result = await axios.post('/api/suggest-doctors',{
    notes:note
  })
  console.log(result.data)
  setSuggestedDoctos(result.data)
  setLoading(false)
}

const onStartConsultation = async()=>{
  setLoading(true)
  // Save all info into database
  const result = await axios.post('/api/session-chat',{
    notes:note,
    selectedDoctor:selectedDoctor
  })
  setLoading(false)
  console.log(result.data);
  if(result.data?.sessionId){
    console.log(result.data.sessionId)
    // Route new conversation screen
    router.push(`/dashboard/medical-agent/${result.data.sessionId}`)
  }
}


  return (
<Dialog>
  <DialogTrigger>
    <Button className='cursor-pointer' disabled={!paidUser || hitoryListRecord?.length >= 2}>+ Start a Consultation</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Basic Details</DialogTitle>
      <DialogDescription asChild>
        <div className='mt-10'>
          {!suggestedDoctors ?
        <div>
            <h2>Add Symptoms or Any Other Details</h2>
            <Textarea placeholder='Add Detail Here...' className='h-[200px] mt-1' 
            onChange={(e) => setNote(e.target.value)}
            />
        </div>: 
        <div>
          <h2 className='text-xl p-2'>Select the doctor</h2>
        <div className='grid grid-cols-3 gap-5'>
          {
          //@ts-ignore
          suggestedDoctors.map((doctor,index)=>(
            <SuggestedDoctorCard setSelectedDoctor={()=>setSelectedDoctor(doctor)} doctorAgent={doctor} key={index}
            // @ts-ignore
            selectedDoctor={selectedDoctor}
             />
          ))}
        </div>
          </div>
          }

        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
        <DialogClose>
        <Button variant={'outline'}>Cancel</Button>
        </DialogClose>
        {!suggestedDoctors? 
        <Button disabled={!note} onClick={()=>OnClickNext()}>
          
          Next {loading ? <Loader2 className='animate-spin'/>: <ArrowRight/>}</Button>:
               <Button disabled={loading || !selectedDoctor} onClick={()=>onStartConsultation()} className='cursor-pointer'>+ Start a Consultation
                {loading ? <Loader2 className='animate-spin'/>: <ArrowRight/>}
               </Button>
            // <DialogTrigger>
            // </DialogTrigger>

        }
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default AddNewSession


// Install the assemblyai package by executing the command "npm install assemblyai"

// import { AssemblyAI } from "assemblyai";

// const client = new AssemblyAI({
//   apiKey: "306e4ac85c5844039f07afc8b42a206a",
// });

// // const audioFile = "./local_file.mp3";
// const audioFile = 'https://assembly.ai/wildfires.mp3'

// const params = {
//   audio: audioFile,
//   speech_model: "universal",
// };

// const run = async () => {
//   const transcript = await client.transcripts.transcribe(params);

//   console.log(transcript.text);
// };

// run();