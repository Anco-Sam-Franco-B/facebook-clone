import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { LogOut, Search, Settings, Edit } from 'lucide-react';
import ProfileModal from './ProfileModal';
import TypingIndicator2 from './TypingIndicator2';

const Sidebar = ({ users, setSelectedChat, selectedChat }) => {
  const { user, logout, showTyping } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="w-[360px] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-gray-900 dark:text-white">Chats</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-900 dark:text-gray-200"
            title="Profile Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={logout}
            className="p-2 bg-gray-100 hover:bg-red-100 dark:bg-gray-800 dark:hover:bg-red-900/40 rounded-full transition-colors text-gray-900 dark:text-gray-200 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Messenger"
            className="w-full pl-9 pr-4 py-2 bg-[#F0F2F5] dark:bg-gray-800 rounded-full outline-none focus:ring-0 text-[15px] dark:text-white placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto mt-2 custom-scrollbar px-2">
        {users.map((u) => {
          const isOnline = onlineUsers.includes(u.id) || u.status === 'online';
          const isActive = selectedChat?.id === u.id;

          return (
            <div 
              key={u.id}
              onClick={() => setSelectedChat(u)}
              className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-[#EBF5FF] dark:bg-gray-800' 
                  : 'hover:bg-[#F0F2F5] dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                {u.avatarUrl ? (
                  <img src={u.avatarUrl} alt={u.name} className="w-[52px] h-[52px] rounded-full object-cover" />
                ) : (
                  <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-messenger-400 to-messenger-600 flex items-center justify-center text-white font-bold text-[19px]">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#31A24C] border-2 border-white dark:border-gray-900 rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-medium text-[15px] text-gray-900 dark:text-white truncate">
                  {u.name}
                </p>
                {showTyping  && <TypingIndicator2 />}
                <p className={`text-[13px] truncate mt-0.5 ${isActive ? 'text-messenger-600 font-medium' : 'text-gray-500'}`}>
                  {isOnline ? 'Active now' : 'Offline'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  );
};

export default Sidebar;
