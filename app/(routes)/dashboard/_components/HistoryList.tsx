"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddNewSession from './AddNewSession'
import axios from 'axios'
import HistoryTable from './HistoryTable'
import { SessionDetail } from '../medical-agent/[sessionId]/page'

function HistoryList({setHitoryListRecord}:any) {

  const [historyList, setHitoryList] = useState<SessionDetail[]>([])

  useEffect(()=>{
    GetHistoryList()
  },[])

  const GetHistoryList = async()=>{
    const result = await axios.get('/api/session-chat?sessionId=all')

    console.log(result.data)
    setHitoryList(result.data)
    setHitoryListRecord(result.data)
  }

  return (
    <div className='mt-10'>
        {
            historyList.length == 0 ? 
            <div className='flex flex-col justify-center items-center gap-5 p-7 border-2 border-dashed rounded-2xl'>
                <Image  src={'/medical-assistance.png'} alt='' width={150} height={150}/>
                <h2 className='font-bold text-xl '>No Recent Consultations</h2>
                <p>It looks like you have't consulted with any doctor yet.</p>
                <AddNewSession/>
            </div>
            : <div>
              <HistoryTable historyList={historyList}/>
              </div>
        }
    </div>
  )
}

export default HistoryList