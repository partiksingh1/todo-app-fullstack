import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from "axios"
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username,setUsername] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const submitHandle = async(e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors({ email: !email ? 'Email is required' : '', password: !password ? 'Password is required' : '' });
            return;
        }
        try {
            const response = await axios.post("http://localhost:8000/user/signup",{username,email,password});
            navigate("/login");
        } catch (error) {
            console.error(error);
            setErrors({ email: 'email is required', password: 'password is required' });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className='p-6 sm:p-8 md:p-10 border-black max-w-md sm:max-w-lg md:max-w-xl w-full'>
                <div className='text-center mb-6'>
                    <h1 className='text-xl md:text-2xl font-semibold'>Signup page</h1>
                </div>
                <div className='border-2 m-2 sm:m-4 rounded-md p-2'>
                    <input
                        type="text"
                        placeholder='username'
                        className='border-none outline-none p-2 w-full'
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </div>
                <div className='border-2 m-2 sm:m-4 rounded-md p-2'>
                    <input
                        type="text"
                        placeholder='email'
                        className='border-none outline-none p-2 w-full'
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>
                
                <div className='border-2 m-2 sm:m-4 rounded-md p-2'>
                    <input
                        type="text"
                        placeholder='password'
                        className='border-none outline-none p-2 w-full'
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
                </div>
                 
                 <div className="flex justify-end" >
                    <p>Already having account? <Link to="/login" className="underline">Login</Link></p>
                </div>
                <div className="flex justify-center mt-4">
                    <input
                        type="button"
                        value="Submit"
                        onClick={submitHandle}
                        className='bg-black text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
