import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import API from '../api/axios';
import { MessageCircle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';

const Chat = () => {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState(location.state?.selectedUser || null);
  const [users, setUsers] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Fetch only accepted friends for chat
        const { data } = await API.get('/friends');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUserUpdated = (updatedUser) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
      if (selectedChat?.id === updatedUser.id) {
        setSelectedChat(prev => ({ ...prev, ...updatedUser }));
      }
    };

    socket.on('user_updated', handleUserUpdated);
    return () => socket.off('user_updated', handleUserUpdated);
  }, [socket, selectedChat]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          users={users} 
          setSelectedChat={setSelectedChat} 
          selectedChat={selectedChat} 
        />
        {selectedChat ? (
          <ChatWindow selectedChat={selectedChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-900 border-l border-transparent">
            <div className="text-center max-w-sm">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-messenger-50 dark:bg-gray-800 rounded-full">
                  <MessageCircle className="w-16 h-16 text-messenger-600 dark:text-gray-400" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">Your Messages</h2>
              <p className="text-[15px] text-gray-500 mt-2">Select a friend to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
