import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import API from '../api/axios';
import { Send, Smile, Paperclip, MoreHorizontal, Phone, Video, Image as ImageIcon, PlusCircle } from 'lucide-react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { user, setIsTyping, setShowTyping, isTyping, showTyping } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await API.get(`/messages/${selectedChat.id}`);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
    socket?.emit('join_chat', selectedChat.id);
  }, [selectedChat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping]);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (message) => {
      if (message.senderId === selectedChat.id || message.receiverId === selectedChat.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const typingHandler = () => setShowTyping(true);
    const stopTypingHandler = () => setShowTyping(false);

    socket.on('message_received', messageHandler);
    socket.on('typing', typingHandler);
    socket.on('stop_typing', stopTypingHandler);

    return () => {
      socket.off('message_received', messageHandler);
      socket.off('typing', typingHandler);
      socket.off('stop_typing', stopTypingHandler);
    };
  }, [socket, selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('stop_typing', selectedChat.id);
    setIsTyping(false);

    const messageData = {
      senderId: user.id,
      receiverId: selectedChat.id,
      messageText: newMessage,
    };

    // Emit via socket
    socket.emit('new_message', messageData);

    // Optimistically add to UI
    setMessages((prev) => [...prev, { ...messageData, id: Date.now(), createdAt: new Date().toISOString() }]);
    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', selectedChat.id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit('stop_typing', selectedChat.id);
        setIsTyping(false);
      }
    }, timerLength);
  };

  const isOnline = onlineUsers.includes(selectedChat.id);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center space-x-3 cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 p-1 pr-3 transition-colors">
          <div className="relative">
            {selectedChat.avatarUrl ? (
              <img src={selectedChat.avatarUrl} alt={selectedChat.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-messenger-400 to-messenger-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedChat.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] border-2 border-white dark:border-gray-900 rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white leading-tight">{selectedChat.name}</h3>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">{isOnline ? 'Active now' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-messenger-600 dark:text-messenger-500">
          <button className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><Phone className="w-5 h-5" fill="currentColor" strokeWidth={1} /></button>
          <button className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><Video className="w-5 h-5" fill="currentColor" strokeWidth={1} /></button>
          <button className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar bg-white dark:bg-gray-900">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === user.id;
          const showAvatar = !isOwn && (index === messages.length - 1 || messages[index + 1]?.senderId === user.id);
          
          return (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              isOwn={isOwn} 
              showAvatar={showAvatar}
              avatarUrl={selectedChat.avatarUrl}
              name={selectedChat.name}
            />
          )
        })}
        {showTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex space-x-1 pb-2">
            <button type="button" className="p-2 text-messenger-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <PlusCircle className="w-[22px] h-[22px]" />
            </button>
            <button type="button" className="p-2 text-messenger-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
              <ImageIcon className="w-[22px] h-[22px]" />
            </button>
            <button type="button" className="p-2 text-messenger-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
              <Paperclip className="w-[22px] h-[22px]" />
            </button>
          </div>
          
          <div className="flex-1 relative bg-[#F0F2F5] dark:bg-gray-800 rounded-[20px] flex items-end min-h-[40px]">
            <input 
              type="text" 
              placeholder="Aa"
              className="flex-1 bg-transparent pl-4 pr-10 py-2.5 outline-none text-[15px] dark:text-white placeholder-gray-500"
              value={newMessage}
              onChange={handleTyping}
            />
            <button type="button" className="p-2.5 text-messenger-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors absolute right-1 bottom-[1px]">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <div className="pb-1.5 pl-1">
            {newMessage.trim() ? (
              <button 
                type="submit" 
                className="p-2 text-messenger-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Send className="w-6 h-6" fill="currentColor" strokeWidth={1} />
              </button>
            ) : (
              <button type="button" className="p-2 text-messenger-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14.886 16.969c-2.316 2.05-6.096 1.942-8.318-.242C4.167 14.364 4.093 10.63 6.425 8.297L13.5 1.222A4.896 4.896 0 0 1 20.425 8.15l-7.075 7.075a2.535 2.535 0 0 1-3.585-3.585l7.075-7.075a1.18 1.18 0 1 1 1.668 1.668l-7.075 7.075a.174.174 0 0 0 .247.247l7.075-7.075a2.535 2.535 0 0 0-3.585-3.585L8.093 9.965A2.535 2.535 0 0 0 11.68 13.55l7.075-7.075a.59.59 0 0 1 .834.834L12.513 14.385l-.013.013c1.782 1.745 4.831 1.83 6.696-.035C21.06 12.5 21.134 9.453 19.269 7.588A6.076 6.076 0 0 0 10.68 16.177l7.075-7.075a1.77 1.77 0 1 1 2.503 2.503l-5.372 5.364z"></path></svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
