import React, { useEffect, useState } from 'react';
import { Search, MoreHorizontal, Video, User } from 'lucide-react';
import API from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';

const RightSidebar = () => {
  const [friends, setFriends] = useState([]);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await API.get('/friends');
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends for sidebar:', error);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className="hidden xl:flex flex-col w-full max-w-[360px] h-fit p-2 sticky top-20">
      <div className="flex items-center justify-between text-gray-500 mb-2 px-2">
        <h3 className="font-bold text-lg text-gray-600 dark:text-gray-400">Contacts</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"><Video className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"><Search className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {friends.length > 0 ? (
          friends.map((friend) => {
            const isOnline = onlineUsers.includes(friend.id);
            return (
              <Link 
                key={friend.id}
                to={`/profile/${friend.id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors group relative"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
                    {friend.avatarUrl ? (
                      <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-facebook-50 text-facebook-600">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                </div>
                <span className="font-semibold text-[15px]">{friend.name}</span>
              </Link>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 px-2 mt-2 italic">Add friends to see them here.</p>
        )}
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 my-4 mx-2"></div>
      
      <h3 className="text-gray-500 font-bold px-2 mb-2">Group conversations</h3>
      <button className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors group">
         <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <PlusIcon />
         </div>
         <span className="font-semibold text-[15px]">Create new group</span>
      </button>
    </div>
  );
};

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export default RightSidebar;
