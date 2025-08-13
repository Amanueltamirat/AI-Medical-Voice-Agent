import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuOtions=[
  {
    id:1,
    name:'Home',
    path:'/dashboard'
  },
  {
    id:2,
    name:'History',
    path:'/dashboard/history'
  },
  {
    id:3,
    name:'Pricing',
    path:'/dashboard/billing'
  },
  {
    id:4,
    name:'Profile',
    path:'/profile'
  },
]


function AppHeader() {




  return (
    <div className='flex justify-between items-center p-4 px-10 lg:px-32 md:px:20 shadow'>
      <Link href={'/'} className='cursor-pointer'>
      <Image src={'/logo.svg'} alt='logo' width={20} height={10} />
      </Link>
      <div className='hidden md:flex gap-12 items-center'>
        {menuOtions.map((item, index) =>(
          <Link href={item?.path} key={index}>
            <h2 className='hover:font-bold cursor-pointer transition-all'>{item.name}</h2>
          </Link>
        ))}
      </div>
      <UserButton/>
    </div>
  )
}

export default AppHeader