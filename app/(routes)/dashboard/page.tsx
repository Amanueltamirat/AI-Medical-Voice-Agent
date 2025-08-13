"use client"
import React, { useState } from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSession from './_components/AddNewSession'
import { SessionDetail } from './medical-agent/[sessionId]/page'

function Dashboard() {

  const [hitoryListRecord, setHitoryListRecord] = useState<SessionDetail[]>([])

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>My Dashboard</h2>
        <AddNewSession hitoryListRecord={hitoryListRecord}/>
      </div>
      <HistoryList setHitoryListRecord={setHitoryListRecord}/>
      
      <DoctorsAgentList/>
    </div>
  )
}

export default Dashboard