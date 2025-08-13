import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import moment from 'moment'

type props={
    record:SessionDetail
} 

function ViewReportDialog({record}:props) {

console.log(record)


  return (
<Dialog>
  <DialogTrigger><Button className='cursor-pointer' variant={'link'} size={'sm'}>View Report</Button></DialogTrigger>
  <DialogContent className='max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6'>
    <DialogHeader>
      <DialogTitle asChild>
        <h2 className='text-center text-4xl'>AI Medical Voice Agent Report</h2></DialogTitle>
      <DialogDescription asChild>
        <div className='space-y-6 text-gray-800 text-sm'>
            <div>
                <h2 className='font-bold text-blue-500 text-lg border-b-2 border-blue-500 pb-2'>Session Info</h2>
            <div className='grid grid-cols-2 gap-2'>
                
                    <h2><span className='font-semibold'>Doctor:</span> {record?.selectedDoctor?.specialist}</h2>

                    <h2><span className='font-semibold'>Consulted On:</span> {moment(new Date(record?.createdOn)).format('MMMM Do YYYY, h:mm:ss a')}</h2>

                    <h2><span className='font-semibold'>User:</span> Anonymous</h2>

                    <h2><span className='font-semibold'>Agent:</span> {record?.report?.agent}</h2>    
            </div>
            </div>

             <div>
                <h2 className='font-bold text-blue-500 text-lg border-b-2 border-blue-500 pb-2'>Chief Complaint</h2>
            <div className=''>
                
                    <p className='font-semibol'>
                        The user did not clearly state a chief complaint in this initial interaction
                        </p>   
            </div>
            </div>

             <div>
                <h2 className='font-bold text-blue-500 text-lg border-b-2 border-blue-500 pb-2'>Summary</h2>
            <div className=''>
                
                    <p className='font-semibol'>
                        {record?.report?.summary}
                        </p>   
            </div>
            </div>

              <div>
                <h2 className='font-bold text-blue-500 text-lg border-b-2 border-blue-500 pb-2'>Symptoms</h2>
            <div className=''>
                
                    <p className='font-semibol flex gap-2'>
                        {record?.report?.symptoms}
                        </p>   
            </div>
            </div>

           <div>
                <h2 className='font-bold text-blue-500 text-lg border-b-2 border-blue-500 pb-2'>Duration & Severity</h2>
            <div className='grid grid-cols-2 gap-2'>
                
                    <p className='font-semibol'>
                        <span className='font-semibold'>Duration:</span> {record?.report?.duration || 'Not specified'}
                        </p> 
                        <p className='font-semibol'>
                        <span className='font-semibold'>Severity:</span> {record?.report?.severity || 'Not specified'}
                        </p>    
            </div>
            </div>
        </div>
        
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default ViewReportDialog