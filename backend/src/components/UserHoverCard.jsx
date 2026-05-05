import React from 'react';
import { User, MessageSquare, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserHoverCard = ({ user }) => {
  return (
    <div className="absolute top-10 left-0 w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
      <div className="flex gap-4 items-start mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden shrink-0 border-2 border-white dark:border-gray-700 shadow-sm">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-facebook-50 text-facebook-600">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-xl hover:underline cursor-pointer">{user.name}</h4>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{user.bio || 'No bio available'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-facebook-600 hover:bg-facebook-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm">
          <UserPlus className="w-4 h-4" /> Add Friend
        </button>
        <Link 
          to="/messages" 
          state={{ selectedUser: user }}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <MessageSquare className="w-4 h-4" /> Message
        </Link>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500">
         <span className="flex items-center gap-1">👥 <b>12</b> mutual friends</span>
      </div>
    </div>
  );
};

export default UserHoverCard;
