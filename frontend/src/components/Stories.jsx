import React from 'react';
import { Plus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Stories = () => {
  const { user } = useAuth();
  
  const stories = [
    { id: 1, name: 'John Doe', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop' },
    { id: 2, name: 'Jane Smith', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=300&fit=crop' },
    { id: 3, name: 'Mike Ross', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=300&fit=crop' },
    { id: 4, name: 'Rachel Zane', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=300&fit=crop' },
  ];

  return (
    <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
      {/* Create Story */}
      <div className="relative min-w-[112px] h-[200px] bg-white dark:bg-gray-800 rounded-xl shadow-sm cursor-pointer group overflow-hidden shrink-0">
        <div className="h-[150px] w-full bg-gray-200 overflow-hidden">
           {user?.avatarUrl ? (
             <img src={user.avatarUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-facebook-50">
               <User className="w-10 h-10 text-facebook-600" />
             </div>
           )}
        </div>
        <div className="absolute bottom-0 w-full h-[50px] flex flex-col items-center justify-end pb-2">
           <div className="absolute -top-4 w-8 h-8 bg-facebook-600 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
           </div>
           <span className="text-[13px] font-semibold">Create story</span>
        </div>
      </div>

      {/* Other Stories */}
      {stories.map(story => (
        <div key={story.id} className="relative min-w-[112px] h-[200px] rounded-xl shadow-sm cursor-pointer group overflow-hidden shrink-0">
          <img src={story.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
          <div className="absolute top-2 left-2 w-10 h-10 rounded-full border-4 border-facebook-600 overflow-hidden z-10">
             <img src={story.image} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="absolute bottom-2 left-2 text-white text-[13px] font-semibold z-10">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
