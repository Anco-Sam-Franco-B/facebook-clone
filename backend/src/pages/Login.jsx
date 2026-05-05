import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-[1000px] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Left Side: Branding */}
        <div className="text-center lg:text-left max-w-[500px]">
          <h1 className="text-facebook-500 font-bold text-6xl mb-4 tracking-tight">facebook</h1>
          <h2 className="text-[28px] leading-8 text-gray-900 font-medium lg:pr-10">
            Facebook helps you connect and share with the people in your life.
          </h2>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-[396px]">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email address or phone number"
                className="px-4 py-3 border border-gray-300 rounded-md focus:border-facebook-500 focus:ring-1 focus:ring-facebook-500 outline-none transition-all text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="px-4 py-3 border border-gray-300 rounded-md focus:border-facebook-500 focus:ring-1 focus:ring-facebook-500 outline-none transition-all text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-facebook-600 hover:bg-facebook-500 text-white font-bold text-xl py-3 rounded-md transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Log In'}
              </button>
              
              <Link to="/forgot" className="text-facebook-600 text-sm hover:underline text-center">
                Forgotten password?
              </Link>
              
              <div className="border-t border-gray-300 my-4"></div>
              
              <div className="text-center pb-2">
                <Link 
                  to="/register" 
                  className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold px-4 py-3 rounded-md transition-colors inline-block"
                >
                  Create new account
                </Link>
              </div>
            </form>
          </div>
          <p className="mt-7 text-sm text-center">
            <span className="font-bold hover:underline cursor-pointer">Create a Page</span> for a celebrity, brand or business.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
