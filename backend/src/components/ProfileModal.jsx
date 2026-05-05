import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Camera } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatarUrl || null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (file) {
        formData.append('avatar', file);
      }
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <img src={preview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-messenger-400 to-messenger-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white dark:border-gray-800 shadow-lg">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-sm text-messenger-600 hover:text-messenger-700 dark:text-messenger-400 font-medium"
            >
              Change Photo
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-messenger-500 focus:border-transparent outline-none transition-all dark:text-white"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-messenger-600 hover:bg-messenger-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
