'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WorkspaceHeader() {
    return (
        <div className='p-4 flex justify-between shadow-md'>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={120}
                height={40} // set to your SVG's natural aspect ratio
                style={{ height: "auto" }} // ensures aspect ratio is preserved
                priority // if above the fold
            />
            <UserButton />
        </div>
    )
}

export default WorkspaceHeader  