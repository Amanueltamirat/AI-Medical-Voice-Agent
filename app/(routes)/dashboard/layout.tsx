import React from 'react'
import AppHeader from './_components/AppHeader';

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {
  return (
    <div>
        {/* <AppHeader/> */}
        <div className='px-10 lg:px-32 md:px:20 py-10'>
        {children}
        </div>
        </div>
  )
}

export default DashboardLayout