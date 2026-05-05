import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [selectedChatId, setSelectedChatId]=useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/users/profile');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const updateProfile = async (formData) => {
    const { data } = await API.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const typingHandler = () => setShowTyping(true);
  const stopTypingHandler = () => setShowTyping(false);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading, setIsTyping, setShowTyping, isTyping, showTyping, selectedChatId, setSelectedChatId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
