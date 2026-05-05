import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center pt-10">
      <h1 className="text-facebook-500 font-bold text-6xl mb-8 tracking-tight">facebook</h1>
      
      <div className="w-full max-w-[432px] bg-white p-4 rounded-lg shadow-xl">
        <div className="border-b border-gray-200 pb-3 mb-4">
           <h2 className="text-2xl font-bold">Create a new account</h2>
           <p className="text-gray-500">It's quick and easy.</p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-facebook-500 transition-all text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Mobile number or email address"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-facebook-500 transition-all text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-facebook-500 transition-all text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <p className="text-[11px] text-gray-500 mt-2">
            People who use our service may have uploaded your contact information to Facebook. <span className="text-blue-600 cursor-pointer">Learn more.</span>
          </p>
          <p className="text-[11px] text-gray-500">
            By clicking Sign Up, you agree to our <span className="text-blue-600 cursor-pointer">Terms</span>, <span className="text-blue-600 cursor-pointer">Privacy Policy</span> and <span className="text-blue-600 cursor-pointer">Cookies Policy</span>. You may receive SMS notifications from us and can opt out at any time.
          </p>

          <div className="text-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00a400] hover:bg-[#008a00] text-white font-bold px-12 py-2 rounded-md transition-colors text-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Sign Up'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
