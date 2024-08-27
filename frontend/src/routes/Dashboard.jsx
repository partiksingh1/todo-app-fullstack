import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/todo/all');
                
                if (response.data.todo) {
                    setTodos(response.data.todo);
                } else {
                    setError('No todos found.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching todos:', error);
                setError('Failed to load todos');
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className='font-bold text-xl mb-4'>Welcome</h1>
            <h2 className='text-lg mb-4'>Your Todos</h2>
            {todos.length === 0 ? (
                <p>No todos available.</p>
            ) : (
                <ul className='list-disc'>
                    {todos.map(todo => (
                        <li key={todo._id} className='mb-2'>
                            {todo.title} - {todo.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dashboard;
