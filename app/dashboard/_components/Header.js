import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='flex justify-end p-5 shawow-sm'>
        <UserButton/>
    </div>
  )
}

export default Header