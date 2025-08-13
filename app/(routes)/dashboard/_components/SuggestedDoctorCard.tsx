import React from 'react'
import { doctorAgent } from './DoctorAgentCard'
import Image from 'next/image'


type props ={
    doctorAgent:doctorAgent,
    setSelectedDoctor:any
    selectedDoctor:doctorAgent
}

function SuggestedDoctorCard({doctorAgent, setSelectedDoctor,selectedDoctor}:props) {
// console.log(doctorAgent)

  return (
    <div className={`flex flex-col justify-center items-center border rounded-2xl shadow p-4 hover:border-blue-500 cursor-pointer ${
      selectedDoctor?.id == doctorAgent?.id && 
      'border-blue-500'
    }`} onClick={()=>setSelectedDoctor(doctorAgent)}>
      <Image src={doctorAgent?.image} alt={doctorAgent?.specialist} width={70} height={70} className='object-cover w-[50px] h-[50px] rounded-4xl'/>
      <h2 className='font-bold text-sm text-center'>{doctorAgent?.specialist}</h2>
      <p className='text-xs text-center line-clamp-2'>{doctorAgent?.description}</p>
    </div>
  )
}

export default SuggestedDoctorCard