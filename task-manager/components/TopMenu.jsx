import React from 'react'

const TopMenu = ({onLogOut}) => {
  return (
    <>
        <nav className="bg-baseColour">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className='flex items-center justify-between h-16'>
                  <div className='flex items-center'>

                 
                  <div className='flex-shrink-0'>
                    <a href="/" className='font-semibold text-lg'>
                        Group 4 Task Management System
                    </a>
                  </div>
                </div>
                <div className='hidden md:block'>
                <div className='ml-4 flex items-center space-x-4'> </div>
              
                <button onClick={onLogOut} className='text-white hover:bg-white hover:text-black rounded-lg p-2'>Log Out</button>
                </div>
            </div>
            </div>
        </nav>
    </>
  )
}

export default TopMenu