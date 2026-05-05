import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Camera, Edit2, Grid, List, MoreHorizontal, UserPlus, UserCheck, UserX, MessageSquare } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendship, setFriendship] = useState({ status: 'NONE' });

  const fetchProfile = async () => {
    try {
      const [userRes, postRes, friendRes] = await Promise.all([
        API.get(`/users/profile/${id}`),
        API.get(`/posts/user/${id}`),
        API.get(`/friends/status/${id}`)
      ]);
      setUser(userRes.data);
      setPosts(postRes.data);
      setFriendship(friendRes.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleAddFriend = async () => {
    try {
      await API.post('/friends/request', { receiverId: id });
      fetchProfile();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await API.put(`/friends/accept/${friendship.friendshipId}`);
      fetchProfile();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const isOwnProfile = currentUser?.id === id;

  const renderFriendButton = () => {
    if (isOwnProfile) return (
      <button className="bg-facebook-600 hover:bg-facebook-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors">
        <Edit2 className="w-4 h-4" /> Edit Profile
      </button>
    );

    switch (friendship.status) {
      case 'ACCEPTED':
        return (
          <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors">
            <UserCheck className="w-4 h-4" /> Friends
          </button>
        );
      case 'PENDING':
        if (friendship.isSender) {
          return (
            <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors">
              <UserX className="w-4 h-4" /> Cancel Request
            </button>
          );
        } else {
          return (
            <button 
              onClick={handleAccept}
              className="bg-facebook-600 hover:bg-facebook-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-4 h-4" /> Accept Request
            </button>
          );
        }
      default:
        return (
          <button 
            onClick={handleAddFriend}
            className="bg-facebook-600 hover:bg-facebook-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add Friend
          </button>
        );
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-gray-900"><Navbar /><div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-b-2 border-facebook-600 rounded-full"></div></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
      <Navbar />
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-[1250px] mx-auto">
          {/* Cover Photo */}
          <div className="relative h-[250px] md:h-[400px] w-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-b-xl overflow-hidden group">
            {user?.coverUrl ? (
              <img src={user.coverUrl} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20"></div>
            )}
            {isOwnProfile && (
              <button className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 px-3 py-2 rounded-md font-semibold flex items-center gap-2 shadow-md">
                <Camera className="w-5 h-5" />
                <span className="hidden sm:inline">Edit cover photo</span>
              </button>
            )}
          </div>

          {/* Profile Info Section */}
          <div className="px-4 md:px-10 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-8 mb-4">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 overflow-hidden shadow-lg">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-facebook-50 text-facebook-600">
                      <span className="text-5xl font-bold">{user?.name?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow-md">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left mb-2">
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-gray-500 font-semibold">{posts.length} posts • 120 friends</p>
              </div>

              <div className="flex gap-2 mb-2">
                {renderFriendButton()}
                {!isOwnProfile && (
                  <button 
                    onClick={() => navigate('/messages', { state: { selectedUser: user } })}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-1">
              <div className="flex gap-1 overflow-x-auto">
                {['Posts', 'About', 'Friends', 'Photos', 'Videos', 'Check-ins', 'More'].map((tab, idx) => (
                  <button key={idx} className={`px-4 py-4 font-semibold text-[15px] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors ${tab === 'Posts' ? 'text-facebook-600 border-b-4 border-facebook-600 rounded-none' : 'text-gray-500'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Body */}
      <main className="max-w-[1250px] mx-auto p-4 flex flex-col lg:flex-row gap-4">
        {/* Left Col - Intro */}
        <div className="w-full lg:w-[450px] flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Intro</h3>
            <p className="text-center text-[15px] mb-4">{user?.bio || 'No bio yet.'}</p>
            {isOwnProfile && (
              <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold py-2 rounded-md transition-colors">
                Edit bio
              </button>
            )}
            <div className="mt-4 flex flex-col gap-3">
               <div className="flex items-center gap-2 text-[15px]"><span className="text-gray-500">Lives in</span> <span className="font-semibold">New York</span></div>
               <div className="flex items-center gap-2 text-[15px]"><span className="text-gray-500">From</span> <span className="font-semibold">London</span></div>
            </div>
          </div>
        </div>

        {/* Right Col - Posts */}
        <div className="flex-1 flex flex-col gap-5">
          {isOwnProfile && <CreatePost onPostCreated={(p) => setPosts([p, ...posts])} />}
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between">
             <h3 className="text-lg font-bold">Posts</h3>
             <div className="flex gap-2">
                <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md font-semibold flex items-center gap-2">
                   <List className="w-4 h-4" /> Filters
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md font-semibold flex items-center gap-2">
                   <MoreHorizontal className="w-4 h-4" /> Manage posts
                </button>
             </div>
          </div>

          <div className="flex flex-col gap-5">
            {posts.length > 0 ? (
              posts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-sm text-center">
                 <h4 className="text-gray-500 font-bold text-lg">No posts to show</h4>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
