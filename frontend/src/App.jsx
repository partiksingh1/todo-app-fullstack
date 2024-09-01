
import { Link, Outlet } from 'react-router-dom'
import './App.css'
import Button from '@mui/material/Button';


function App() {

  return (
    <div>
      <Outlet />
      <div className="flex items-center justify-center h-screen">
            <div className='p-6 sm:p-8 md:p-10 border-black max-w-md sm:max-w-lg md:max-w-xl w-full'>
                <div className='text-center mb-6'>
                    <h1 className='text-xl md:text-2xl font-semibold'>Welcome to the app</h1>
                </div>

                <div className="flex justify-center mt-4">
                <Link to="/login">
              <Button 
                variant="contained" 
                color="primary" 
                className="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Click here
              </Button>
            </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
