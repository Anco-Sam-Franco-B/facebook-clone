import React, { useState } from 'react';
import { X, Image, User, Video, Smile, MapPin, Tag, MoreHorizontal, Globe, ChevronDown } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const { data } = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onPostCreated(data);
      setContent('');
      setImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10"></div>
          <h2 className="text-xl font-bold">Create post</h2>
          <button onClick={onClose} className="w-9 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-facebook-100 flex items-center justify-center"><User className="w-6 h-6 text-facebook-600" /></div>}
          </div>
          <div>
            <h4 className="font-bold text-[15px]">{user?.name}</h4>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md mt-0.5 cursor-pointer hover:bg-gray-200 transition-colors">
              <Globe className="w-3 h-3 text-gray-600" />
              <span className="text-xs font-semibold">Public</span>
              <ChevronDown className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 pb-2">
          <textarea 
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            className={`w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-500 custom-scrollbar ${content.length < 80 && !imagePreview ? 'text-2xl min-h-[150px]' : 'text-base min-h-[100px]'}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          ></textarea>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="px-4 mb-4">
            <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group">
              <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[300px] object-cover" />
              <button 
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shadow-md z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-4 pb-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex items-center justify-between mb-4">
            <span className="font-bold text-[15px] px-2">Add to your post</span>
            <div className="flex items-center gap-1">
              <input type="file" id="modal-image-input" accept="image/*" onChange={handleImageChange} className="hidden" />
              <button onClick={() => document.getElementById('modal-image-input').click()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Photo/video"><Image className="w-6 h-6 text-green-500" /></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Tag people"><Tag className="w-6 h-6 text-blue-500" /></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Feeling/activity"><Smile className="w-6 h-6 text-yellow-500" /></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="Check in"><MapPin className="w-6 h-6 text-red-500" /></button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" title="More"><MoreHorizontal className="w-6 h-6 text-gray-500" /></button>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !image)}
            className="w-full bg-facebook-600 hover:bg-facebook-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
