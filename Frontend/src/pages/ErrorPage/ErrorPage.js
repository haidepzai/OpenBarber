import React from 'react'
import "../../css/ErrorPage/ErrorPage.css"
import image from './assets/error_404.png'

const ErrorPage = () => {
  return (
    <div className='center'>
        <a href='/'>
            <img src={image} alt={'Image of an 404 error'} width="40%" />
            Click to return back to our landing page.
        </a>
    </div>
  )
}

export default ErrorPage