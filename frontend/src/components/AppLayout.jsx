import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './Body'
import herobg from '../assets/herobg4.jpg'
import { Provider } from 'react-redux'
import store from '../utils/store'
import Login from './Login'
import SignUp from './SignUp'
import AsliAppLayout from './AsliAppLayout'

const AppLayout = () => {
    const appRouter = createBrowserRouter([
        {
            path : "/",
            element : <AsliAppLayout/>,
            children : [
              {
                path : "/",
                element : <Body/>
              },
              {
                path : "/login",
                element : <Login/>,
              },
              {
                path : "/signup",
                element : <SignUp/>
              }
            ]
        },
    ])
  return (
    <Provider store={store}>
    <div className='font-serif h-screen box-border bg-cover bg-repeat' style={{ backgroundImage: `url(${herobg})` }}>
      <RouterProvider router={appRouter}/>
    </div>
    </Provider>
  )
}

export default AppLayout
