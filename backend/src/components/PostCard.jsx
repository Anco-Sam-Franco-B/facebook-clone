import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import UserHoverCard from './UserHoverCard';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [showHover, setShowHover] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(post.likes?.some(l => l.userId === user?.id));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = [
    { label: 'Like', icon: '👍', color: 'text-facebook-500' },
    { label: 'Love', icon: '❤️', color: 'text-red-500' },
    { label: 'Care', icon: '🥰', color: 'text-yellow-500' },
    { label: 'Haha', icon: '😆', color: 'text-yellow-500' },
    { label: 'Wow', icon: '😮', color: 'text-yellow-500' },
    { label: 'Sad', icon: '😢', color: 'text-yellow-500' },
    { label: 'Angry', icon: '😡', color: 'text-orange-500' },
  ];

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/posts/${post.id}/like`);
      setIsLiked(data.liked);
      if (data.liked) {
        setLikes([...likes, { userId: user?.id }]);
      } else {
        setLikes(likes.filter(l => l.userId !== user?.id));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await API.post(`/posts/${post.id}/comment`, { content: commentText });
      setComments([...comments, data]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 relative"
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
        >
          <Link to={`/profile/${post.author.id}`} className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
            {post.author.avatarUrl ? (
              <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-facebook-100 text-facebook-600 font-bold">
                {post.author.name.charAt(0)}
              </div>
            )}
          </Link>
          <div>
            <Link to={`/profile/${post.author.id}`} className="font-bold text-[15px] hover:underline cursor-pointer">{post.author.name}</Link>
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span title="Public">🌎</span>
            </div>
          </div>
          {showHover && <UserHoverCard user={post.author} />}
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-normal">{post.content}</p>
      </div>
      
      {post.imageUrl && (
        <div className="bg-gray-100 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-700">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto max-h-[600px] object-contain mx-auto" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1.5 text-gray-500 text-[14px] hover:underline cursor-pointer">
           <div className="flex -space-x-1">
              <div className="w-5 h-5 bg-facebook-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white">👍</div>
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-white">❤️</div>
           </div>
           <span>{likes.length > 0 ? (isLiked ? `You and ${likes.length - 1} others` : likes.length) : 'Be the first to like'}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 text-[14px]">
          <span className="hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </span>
          <span className="hover:underline cursor-pointer">0 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-1 py-1 flex items-center relative">
        <div 
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
          className="flex-1 relative"
        >
          {/* Reactions Popover */}
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 shadow-xl rounded-full p-1.5 flex items-center gap-1.5 border border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              {reactions.map((react, i) => (
                <button 
                  key={i} 
                  className="w-10 h-10 hover:scale-125 transition-transform flex items-center justify-center text-2xl"
                  title={react.label}
                  onClick={() => {
                    handleLike();
                    setShowReactions(false);
                  }}
                >
                  {react.icon}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={handleLike}
            className={`w-full flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ${isLiked ? 'text-facebook-600' : 'text-gray-500'}`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-semibold text-[14px]">Like</span>
          </button>
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold text-[14px]">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500">
          <Share2 className="w-5 h-5" />
          <span className="font-semibold text-[14px]">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-transparent">
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto mb-4 scrollbar-hide">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  {comment.author.avatarUrl ? <img src={comment.author.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-300"></div>}
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-2xl relative">
                  <h5 className="font-bold text-xs hover:underline cursor-pointer">{comment.author.name}</h5>
                  <p className="text-sm">{comment.content}</p>
                  
                  {/* Comment Actions */}
                  <div className="absolute -bottom-5 left-2 flex gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                    <button className="hover:underline">Like</button>
                    <button className="hover:underline">Reply</button>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: false }).replace('about ', '')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-4"></div>

          <form onSubmit={handleComment} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
               {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1.5 flex items-center">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
