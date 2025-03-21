import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // State to manage loading status
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);  // Set loading to true when login starts
    try {
      const response = await axios.post('https://backend-pbn5.onrender.com/api/admin/login', {
        email,
        password
      });
      console.log('Login Successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.admin.name);
      setLoading(false);  // Set loading to false when login is successful
      navigate('/dashboard', { state: { email } });
    } catch (error) {
      console.error('Login Failed:', error.response ? error.response.data : error.message);
      alert("Login failed: " + (error.response ? error.response.data.message : "Check your network connection."));
      setLoading(false);  // Ensure to set loading to false if there's an error
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
