import React from 'react'

const Preloader = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
       <div className='md:grid grid-cols-3'>
        <div></div>
        <div>
          <img src="https://assets-v2.lottiefiles.com/a/8292d350-1184-11ee-8d42-67da1d16bb10/UlxtGUHzqH.gif" alt="Loading" />
          
        </div>
       </div>
    </div>
  )
}

export default Preloader
