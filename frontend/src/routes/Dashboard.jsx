import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [todoTitle, setTodoTitle] = useState("");
    const [todoDescription, setTodoDescription] = useState("");
    const [todoStatus, setTodoStatus] = useState("pending");
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/todo/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.todos) {
                    setTodos(response.data.todos);
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
    }, [userId, token]);
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/todo/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Failed to delete todo');
        }
    };
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:8000/todo/edit/${id}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos(todos.map(todo => todo._id === id ? response.data : todo));
        } catch (error) {
            console.error('Error updating todo status:', error);
            setError('Failed to update todo status');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTodo = {
                user: userId,
                title: todoTitle,
                description: todoDescription,
                status: todoStatus,
            };
            const response = await axios.post('http://localhost:8000/todo/addTodo', newTodo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setTodos([...todos, response.data.todo]);
                setTodoTitle("");
                setTodoDescription("");
                setTodoStatus("pending");
            }
        } catch (error) {
            console.error('Error adding todo:', error);
            setError('Failed to add todo');
        }
    };
    const handleSignout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login'); // Redirect to the login page or home page
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'inprogress':
                return 'bg-blue-200 text-blue-800';
            case 'completed':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h1 className="font-bold text-3xl text-center mb-8 text-gray-800">Welcome</h1>
                <h2 className="text-2xl mb-4 text-gray-700 text-center">{username}</h2>
                <div className="max-h-64 overflow-y-auto">
                    {todos.length === 0 ? (
                        <p className="text-gray-500 text-center">No todos available.</p>
                    ) : (
                        <ul className="list-none space-y-4">
                            {todos.map((todo) => (
                                <li
                                    key={todo._id}
                                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{todo.title}</p>
                                        <p className="text-gray-600">{todo.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={todo.status}
                                            onChange={(e) => handleUpdateStatus(todo._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(todo.status)}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <button
                                            onClick={() => handleDelete(todo._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="w-full max-w-md mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl mb-4 text-gray-700 text-center">Add Todo</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="border-2 border-gray-300 rounded-md p-2 focus-within:border-blue-500">
                        <label htmlFor="title" className="sr-only">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={todoTitle}
                            onChange={(e) => setTodoTitle(e.target.value)}
                            placeholder="Add a title"
                            className="border-none outline-none p-2 w-full bg-transparent"
                        />
                    </div>
                    <div className="border-2 border-gray-300 rounded-md p-2 focus-within:border-blue-500">
                        <label htmlFor="description" className="sr-only">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={todoDescription}
                            onChange={(e) => setTodoDescription(e.target.value)}
                            placeholder="Add a description"
                            className="border-none outline-none p-2 w-full bg-transparent"
                        />
                    </div>
                    <div className="border-2 border-gray-300 rounded-md p-2 focus-within:border-blue-500">
                        <label htmlFor="status" className="sr-only">Status</label>
                        <select
                            id="status"
                            value={todoStatus}
                            onChange={(e) => setTodoStatus(e.target.value)}
                            className="border-none outline-none p-2 w-full bg-transparent"
                        >
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    >
                        Add Todo
                    </button>
                </form>
                <button
                    onClick={handleSignout}
                    className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mb-4 mt-4"
                >
                    Sign Out
                </button>
            </div>
            
        </div>
    );
}

export default Dashboard;
