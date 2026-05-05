import React from 'react';
import { User, Users, Group, Store, PlayCircle, Clock, Bookmark, Flag, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
  const { user } = useAuth();

  const items = [
    { icon: <Users className="w-9 h-9 text-blue-500" />, label: 'Friends', to: '/friends' },
    { icon: <Clock className="w-9 h-9 text-blue-400" />, label: 'Memories', to: '/memories' },
    { icon: <Bookmark className="w-9 h-9 text-purple-500" />, label: 'Saved', to: '/saved' },
    { icon: <Group className="w-9 h-9 text-blue-600" />, label: 'Groups', to: '/groups' },
    { icon: <Video className="w-9 h-9 text-blue-500" />, label: 'Video', to: '/video' },
    { icon: <Store className="w-9 h-9 text-blue-400" />, label: 'Marketplace', to: '/marketplace' },
    { icon: <Flag className="w-9 h-9 text-orange-500" />, label: 'Pages', to: '/pages' },
    { icon: <Calendar className="w-9 h-9 text-red-500" />, label: 'Events', to: '/events' },
  ];

  return (
    <div className="flex flex-col gap-1 p-2 w-full max-w-[360px] h-fit">
      <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors group">
        <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden shrink-0">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-facebook-100 text-facebook-600">
              <User className="w-6 h-6" />
            </div>
          )}
        </div>
        <span className="font-semibold text-[15px]">{user?.name}</span>
      </Link>

      {items.map((item, idx) => (
        <Link key={idx} to={item.to} className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors group">
          <div className="shrink-0">{item.icon}</div>
          <span className="font-semibold text-[15px]">{item.label}</span>
        </Link>
      ))}

      <button className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors group">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
          <ChevronDown className="w-6 h-6" />
        </div>
        <span className="font-semibold text-[15px]">See more</span>
      </button>

      <div className="border-t border-gray-300 dark:border-gray-700 my-4 mx-2"></div>
      
      <h3 className="text-gray-500 font-semibold px-4 mb-2">Your shortcuts</h3>
      {/* Shortcut items */}
    </div>
  );
};

// Sub-component for icons to avoid import errors
const Video = ({ className }) => <PlayCircle className={className} />;

export default LeftSidebar;
