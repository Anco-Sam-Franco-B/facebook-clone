import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingMessenger = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <Link 
      to="/messages" 
      className="fixed bottom-6 right-6 w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center text-facebook-600 hover:bg-gray-100 transition-all z-40 border border-gray-200 group"
    >
      <div className="relative">
         <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-messenger-500 to-messenger-600 rounded-full text-white shadow-lg transform group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
               <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.513 3.735 7.234V22l3.374-1.85a10.27 10.27 0 002.891.411c5.523 0 10-4.146 10-9.258S17.523 2 12 2zm1.096 12.383l-2.585-2.756-5.048 2.756 5.551-5.894 2.65 2.756 4.983-2.756-5.551 5.894z" />
            </svg>
         </div>
         <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
            1
         </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        New Message
      </div>
    </Link>
  );
};

export default FloatingMessenger;
