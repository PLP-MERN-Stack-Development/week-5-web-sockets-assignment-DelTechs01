import { useEffect, useState } from 'react';

export default function useSocket(socket) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (document.hidden) setUnreadCount((prev) => prev + 1);
    });

    socket.on('messages', (msgs) => {
      setMessages((prev) => [...msgs, ...prev]);
    });

    socket.on('userStatus', ({ users }) => {
      setUsers(users);
    });

    socket.on('typing', ({ username }) => {
      setTyping(username);
      setTimeout(() => setTyping(null), 3000);
    });

    socket.on('notification', ({ message }) => {
      new Notification(message);
      const audio = new Audio('/notification.mp3');
      audio.play();
    });

    const handleVisibility = () => {
      if (!document.hidden) setUnreadCount(0);
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      socket.off('message');
      socket.off('messages');
      socket.off('userStatus');
      socket.off('typing');
      socket.off('notification');
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [socket]);

  return { messages, setMessages, users, typing, unreadCount };
}