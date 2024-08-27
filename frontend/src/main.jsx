import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactDOM from "react-dom/client";
import App from './App.jsx'
import './index.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Login from './routes/Login.jsx'
import Signup from './routes/Signup.jsx';
import Dashboard from './routes/Dashboard.jsx';

const router  = createBrowserRouter([
  {
    path:"/",
    element:<App />
  },
  {
    path:"login",
    element:<Login/>
  },
  {
    path:"signup",
    element:<Signup/>
  },
  {
    path:"dashboard",
    element:<Dashboard />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
