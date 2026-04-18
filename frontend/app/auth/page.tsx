'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? 'auth/login' : 'auth/register';
      console.log(`Sending ${isLogin ? 'Login' : 'Registration'} request to: ${endpoint}`);
      
      const { data } = await api.post(endpoint, formData);
      console.log('API Response Success:', data);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error Response:', err.response?.data);
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
        
        // Specific handling based on status codes if needed
        if (err.response?.status === 409) {
          setError('This email is already registered. Please login instead.');
        } else if (err.response?.status === 400) {
          setError(errorMessage);
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(errorMessage);
        }
      } else {
        console.error('Unexpected Error:', err);
        setError('An unexpected error occurred. Please check your connection.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-md border p-3"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border p-3"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border p-3"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-600 hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
