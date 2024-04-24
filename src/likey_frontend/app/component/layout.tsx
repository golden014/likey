import React from 'react'
import Navbar from './navbar'

const PageLayout = ({pageName , component} : {pageName : string, component : React.ReactNode}) => {
  return (
    <div className='w-screen h-screen bg-background flex justify-around items-center'>
        <Navbar pageName={pageName}/>
        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
          {component}
        </div>
      </div>
  )
}

export default PageLayout