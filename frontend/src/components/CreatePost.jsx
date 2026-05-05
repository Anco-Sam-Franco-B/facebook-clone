import React, { useState } from 'react';
import { Image, Video, Smile, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-3 items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-facebook-100 text-facebook-600">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2.5 rounded-full flex-1 text-left text-gray-500 transition-colors text-[17px] font-medium"
          >
            What's on your mind, {user?.name?.split(' ')[0]}?
          </button>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex items-center">
          <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
            <Video className="w-6 h-6 text-red-500" />
            <span className="font-semibold text-gray-500 text-[14px] group-hover:text-gray-700">Live Video</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
            <Image className="w-6 h-6 text-green-500" />
            <span className="font-semibold text-gray-500 text-[14px] group-hover:text-gray-700">Photo/video</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
            <Smile className="w-6 h-6 text-yellow-500" />
            <span className="font-semibold text-gray-500 text-[14px] group-hover:text-gray-700">Feeling/activity</span>
          </button>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={onPostCreated} 
      />
    </>
  );
};

export default CreatePost;
