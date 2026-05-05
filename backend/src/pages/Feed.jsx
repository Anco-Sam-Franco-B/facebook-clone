import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import Stories from '../components/Stories';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import FloatingMessenger from '../components/FloatingMessenger';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-[1440px] mx-auto flex justify-center lg:justify-between gap-4 py-4 px-2 md:px-4">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden xl:block w-[360px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
          <LeftSidebar />
        </div>

        {/* Center - Feed */}
        <div className="flex-1 max-w-[680px] flex flex-col gap-5">
          <Stories />
          <CreatePost onPostCreated={handlePostCreated} />
          
          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-5 pb-10">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-sm text-center">
                  <h3 className="text-gray-500 font-bold text-xl">No posts yet</h3>
                  <p className="text-gray-400 mt-2">Add friends or create a post to see something here!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Desktop Only */}
        <div className="hidden lg:block w-[280px] xl:w-[360px]">
          <RightSidebar />
        </div>
      </main>

      <FloatingMessenger />
    </div>
  );
};

export default Feed;
