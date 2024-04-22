"use client"
import React from 'react'
import Navbar from '../component/navbar';
import ExplorePage from './pages/explore';

const page = () => {

    const [pageName, setPageName] = React.useState<string>("Explore")

    const handleChanges = (newPageName : string) => {
      setPageName(newPageName)
    }

    const renderPage = () => {
      if(pageName == "Explore"){
        return(
            <ExplorePage/>
        )
      }
      else if(pageName == "Profile"){
        return(
          <div>
            Profile
          </div>
        )
      }
      else if(pageName == "Chat"){
        return(
          <div>
            Chat
          </div>
        )
      }
      else if(pageName == "Interest"){
        return(
          <div>
            Interest
          </div>
        )
      }
      else if(pageName == "Payment"){
        return(
          <div>
            Payment
          </div>
        )
      }
      else if(pageName == "Setting"){
        return(
          <div>
            Setting
          </div>
        )
      }
    }

    return (
      <div className='w-screen h-screen bg-background flex justify-around items-center'>
        <Navbar pageName={pageName} handleChange={handleChanges}/>
        <div className='bg-background border-3 border-border_placeholder shadow-2xl h-fit_screen w-page_width rounded-default p-4'>
          {renderPage()}
        </div>
      </div>
    )
}

export default page
