import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, MessageSquare, Bell, User, LogOut, Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

  useEffect(() => {
    const fetchRequestsCount = async () => {
      if (user) {
        try {
          const { data } = await API.get('/friends/requests');
          setFriendRequestsCount(data.length);
        } catch (error) {
          console.error('Error fetching requests count:', error);
        }
      }
    };
    fetchRequestsCount();
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        try {
          const { data } = await API.get(`/users/search?query=${searchQuery}`);
          setSearchResults(data);
          setShowSearch(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setSearchResults([]);
        setShowSearch(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-14 flex items-center px-4">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-2 flex-1 relative">
        <Link to="/" className="text-facebook-600 dark:text-blue-500 font-bold text-4xl tracking-tighter">
          f
        </Link>
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search Facebook" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearch(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 w-[320px] bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
            {searchResults.map(result => (
              <div key={result.id} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                <Link 
                  to={`/profile/${result.id}`}
                  onClick={() => setShowSearch(false)}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {result.avatarUrl ? (
                      <img src={result.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-facebook-50 text-facebook-600 font-bold">
                        {result.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-sm truncate">{result.name}</span>
                </Link>
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await API.post('/friends/request', { receiverId: result.id });
                      // Optionally update local state to show "Requested"
                      setSearchResults(prev => prev.filter(u => u.id !== result.id));
                    } catch (error) {
                      console.error('Error adding friend:', error);
                    }
                  }}
                  className="p-2 hover:bg-facebook-100 dark:hover:bg-blue-900/30 text-facebook-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Add Friend"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Middle: Icons */}
      <div className="flex items-center gap-2 md:gap-8 flex-1 justify-center h-full">
        <Link to="/" className="nav-link group relative flex items-center justify-center w-20 md:w-28 h-full border-b-4 border-facebook-600">
          <Home className="w-6 h-6 text-facebook-600" />
        </Link>
        <div className="relative group">
           <button className="nav-link flex items-center justify-center w-20 md:w-28 h-full border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
             <Plus className="w-6 h-6 text-gray-500" />
           </button>
           {/* Simple Create Menu */}
           <div className="absolute top-14 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-[80]">
              <h3 className="font-bold px-3 py-2 text-lg">Create</h3>
              {['Post', 'Story', 'Room', 'Page', 'Ad', 'Group', 'Event'].map(item => (
                <button key={item} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left font-semibold">
                   <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {item === 'Post' ? '📝' : item === 'Story' ? '📖' : item === 'Group' ? '👥' : '✨'}
                   </div>
                   <span>{item}</span>
                </button>
              ))}
           </div>
        </div>
        <Link to="/friends" className="nav-link group relative flex items-center justify-center w-20 md:w-28 h-full border-b-4 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Users className="w-6 h-6 text-gray-500 group-hover:text-facebook-600" />
          {friendRequestsCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white dark:border-gray-800">
              {friendRequestsCount}
            </div>
          )}
        </Link>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-2 flex-1 justify-end relative">
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors ${showProfileMenu ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-facebook-100 text-facebook-600">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
          <span className="hidden lg:block font-semibold text-sm">{user?.name?.split(' ')[0]}</span>
        </button>

        {/* Profile Menu Dropdown */}
        {showProfileMenu && (
          <div className="absolute top-12 right-0 w-[360px] bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 z-[70] animate-in fade-in zoom-in-95 duration-100">
             <Link to={`/profile/${user?.id}`} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors mb-2 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                   {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div>
                   <h4 className="font-bold text-lg leading-tight">{user?.name}</h4>
                   <p className="text-gray-500 text-sm">See your profile</p>
                </div>
             </Link>

             <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

             <div className="flex flex-col gap-1">
                <button className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left font-semibold">
                   <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><User className="w-5 h-5" /></div>
                   <span>Settings & Privacy</span>
                </button>
                <button className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left font-semibold">
                   <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">❓</div>
                   <span>Help & Support</span>
                </button>
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left font-semibold"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">🌙</div>
                      <span>Display & Accessibility</span>
                   </div>
                   <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-facebook-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                   </div>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors w-full text-left font-semibold"
                >
                   <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
                   <span>Log Out</span>
                </button>
             </div>
          </div>
        )}
        
        <Link to="/messages" className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative group">
           <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-200" />
           <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white dark:border-gray-800">2</div>
        </Link>

        <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative group">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white dark:border-gray-800">5+</div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
