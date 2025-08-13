"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard'
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Vapi from '@vapi-ai/web';

export type SessionDetail = {
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:doctorAgent,
  createdOn:string,
  hitoryListRecord:string,
  agent:string,
  summary:string,
  symptoms:string,
  duration:number,
  severity:string
 
}

type messages = {
  role:string,
  text:string
}

function MedicalVoiceAgent() {

 const {sessionId} = useParams()
 const [loading, setLoading] = useState(false)
 const [sessionDetail, setSessionDetail] = useState<SessionDetail>()
 const [callStarted, setCallStarted] = useState(false)
 const [vapiInstance, setVapiInstance] = useState<any>()
 const [currentRole, setCurrentRole] = useState<string | null>();
 const [liveTranscript, setLiveTranscript] = useState<string>()
  const [messages, setMessage] = useState<messages[]>([])


  const router = useRouter();


 useEffect(()=>{
  sessionId && GetSessionDetails()
 },
 [sessionId])


 const GetSessionDetails = async()=>{
   try {
     const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`,{
        headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
     })
    console.log(result.data)
    setSessionDetail(result.data)
   } catch (e) {
    console.log(e)
   }
 }

const StartCall = ()=>{
  const vapi = new Vapi(process.env.NEXT_PUBLIC_API_KEY!);
  setVapiInstance(vapi)


  const VapiAgentConfig = {
    name:"AI Medical Doctor Voice Agent",
    firstMessage:"Hi there! I'm your voice assistant. How can I help you tody?",
    transcriber:{
      provider:"assembly-ai",
      language:"en",
    },
    voice:{
      provider:"vapi",
      voiceId:sessionDetail?.selectedDoctor?.voiceId,
    },
    model:{
      provider:"google",
      model:"gemini-2.5-flash-lite",
      messages:[
        {
          role:"system",
          content:sessionDetail?.selectedDoctor?.agentPrompt
        }
      ]
    }
  }

  // vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID)
  //@ts-ignore
  vapi.start(VapiAgentConfig)
  // Listen for events
vapi.on("call-start", function(){
  try {
     console.log('Call started')
  setCallStarted(true)
  } catch (error) {
    console.log('Error inside call start')
  }
 
  });
vapi.on("call-end", function(){
  try {
     setCallStarted(false)
  console.log('Call ended')
  } catch (error) {
    console.log('Error inside call end')
  }
  });
vapi.on("message", function(message){
  try {
     if (message.type === 'transcript') {
     const {role, transcript, transcriptType } = message
    // console.log(`${message.role}: ${message.transcript}`);
    if(transcriptType === 'partial'){
    setLiveTranscript(transcript);
    setCurrentRole(role)
    } else if(transcriptType === 'final') {
      //
      setMessage((prev:any)=>[...prev, {role:role, text:transcript}])

      setLiveTranscript("");
      setCurrentRole(null)
    }
  }
  } catch (error) {
    console.log('Error inside message')
  }
});

vapiInstance.on("speech-start", function(){
  try {
    console.log('Assistant is started speaking');
  setCurrentRole('assistant') 
  } catch (error) {
      console.log('Error inside speech start')
  } 
})

vapiInstance.on("speech-end", function(){
  try {
     console.log('Assistant stopped speaking');
  setCurrentRole('user')
  } catch (error) {
    console.log('Error inside speech end')
  }
 
})

}

const endCall = async()=>{

      setLoading(true)
      const result = await generateReport();
      router.replace('/dashboard')
   if(!vapiInstance) return;
     vapiInstance.stop()
  
    vapiInstance.off('call-start');
    vapiInstance.off('call-end');

    vapiInstance.off('message');
    vapiInstance.off('speech-start');
    vapiInstance.off('speech-end');
    setCallStarted(false);
    setVapiInstance(null)
   
    
    
    setLoading(false)  
}

const generateReport = async()=>{
  const result = await axios.post('/api/medical-report',{
    messages:messages,
    sessionDetail:sessionDetail,
    sessionId:sessionId
  })
  console.log(result.data)
  return result.data;
}

  return (
    <div className='p-5 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`h-4 w-4 rounded-full ${callStarted? 'bg-green-500': 'bg-red-500'}`}/> {callStarted? 'Connected...':'Not Connected'}</h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>
      {sessionDetail && <div className='flex items-center flex-col mt-10'>
        <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist}
        height={80}
        width={80}
        className='h-[100px] w-[100px] obeject-cover rounded-full'
        />
        <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
        <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
        <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
          {messages?.slice(-4).map((msg:messages, index)=>(
              <h2 key= {index} className='text-gray-400 p-2'>{msg.role}:{msg.text}</h2>
            
          ))}
            
            {liveTranscript && liveTranscript?.length > 0 && <h2 className='text-lg'>{currentRole}: {liveTranscript}</h2>}
        </div>
       {!callStarted ? (
        <Button onClick={StartCall}  className='cursor-pointer mt-10'>
          {/* {loading ? <Loader className='animate-spin'/>: <PhoneCall/>}  */}
          <PhoneCall/> Start Call</Button>)
          :( <Button  onClick={endCall} variant={'destructive'} className='cursor-pointer mt-10'>
          {/* {loading ? <Loader className='animate-spin'/> : <PhoneOff/>} */}
          <PhoneOff/> Disconnect</Button>)
          }
      </div>}
    </div>
  )
}

export default MedicalVoiceAgent 