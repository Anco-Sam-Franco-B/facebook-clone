import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import API from '../api/axios';
import { UserCheck, UserPlus, UserX, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        API.get('/friends'),
        API.get('/friends/requests')
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.put(`/friends/accept/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/friends/reject/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-[1440px] mx-auto flex justify-between gap-8 py-4">
        {/* Left Sidebar */}
        <div className="hidden xl:block w-[360px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
          <LeftSidebar />
        </div>

        {/* Center - Friends Management */}
        <div className="flex-1 max-w-[1000px] flex flex-col gap-8 mx-auto px-4">
          
          {/* Friend Requests Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Friend Requests</h2>
              <Link to="/friends" className="text-facebook-600 hover:bg-facebook-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">See all</Link>
            </div>
            
            {requests.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">When you have friend requests, you'll see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {requests.map(req => (
                  <div key={req.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <Link to={`/profile/${req.sender.id}`} className="block aspect-square bg-gray-200 overflow-hidden">
                      {req.sender.avatarUrl ? (
                        <img src={req.sender.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                          {req.sender.name.charAt(0)}
                        </div>
                      )}
                    </Link>
                    <div className="p-3">
                      <Link to={`/profile/${req.sender.id}`} className="font-bold hover:underline mb-3 block truncate">{req.sender.name}</Link>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleAccept(req.id)}
                          className="w-full bg-facebook-600 hover:bg-facebook-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* All Friends Section */}
          <section className="pb-10">
            <h2 className="text-2xl font-bold mb-4">All Friends</h2>
            {friends.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 font-medium">You haven't added any friends yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map(friend => (
                  <div key={friend.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                    <Link to={`/profile/${friend.id}`} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-inner">
                        {friend.avatarUrl ? (
                          <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-facebook-600 font-bold text-xl">
                            {friend.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg hover:underline">{friend.name}</h4>
                        <p className="text-gray-500 text-sm">12 Mutual Friends</p>
                      </div>
                    </Link>
                    <Link 
                      to="/messages" 
                      state={{ selectedUser: friend }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-facebook-600 transition-colors"
                    >
                      <UserCheck className="w-6 h-6" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Friends;
