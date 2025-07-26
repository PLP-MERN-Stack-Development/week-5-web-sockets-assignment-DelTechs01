import { useState, useContext } from 'react';
import useSocket from '../hooks/useSocket';
import Message from './Message';
import { SocketContext } from '../context/SocketContext';

function Chat({ user }) {
  const socket = useContext(SocketContext);
  const { messages, setMessages, users, typing, unreadCount } = useSocket(socket);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('global');
  const [recipient, setRecipient] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 20;

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (recipient) {
        socket.emit('privateMessage', { to: recipient, message });
      } else {
        socket.emit('message', { room, message }, ({ status, id }) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status } : m))
          );
        });
      }
      setMessage('');
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('file', { room, file: reader.result, filename: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      setPage((prev) => prev + 1);
      socket.emit('loadMessages', { room, page: page + 1, limit });
    }
  };

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}</h2>
      {unreadCount > 0 && (
        <p className="text-red-500 mb-2">{unreadCount} unread messages</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Online Users</h3>
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.username} className="text-sm">
                {u.username} ({u.status})
              </li>
            ))}
          </ul>
          <select
            onChange={(e) => {
              setRoom(e.target.value);
              setMessages([]);
              setPage(0);
              socket.emit('joinRoom', e.target.value);
              socket.emit('loadMessages', { room: e.target.value, page: 0, limit });
            }}
            className="w-full p-2 border rounded-lg mt-4"
          >
            <option value="global">Global</option>
            <option value="room1">Room 1</option>
            <option value="room2">Room 2</option>
          </select>
          <select
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-2 border rounded-lg mt-2"
          >
            <option value="">Private Message</option>
            {users
              .filter((u) => u.username !== user.username)
              .map((u) => (
                <option key={u.username} value={u.username}>
                  {u.username}
                </option>
              ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Chat ({room})</h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages"
            className="w-full p-2 border rounded-lg mb-4"
          />
          <div className="chat-container bg-white p-4 rounded-lg shadow" onScroll={handleScroll}>
            {filteredMessages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {typing && <p className="text-gray-500">{typing} is typing...</p>}
          </div>
          <form onSubmit={sendMessage} className="flex space-x-2 mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit('typing', { room, username: user.username });
              }}
              placeholder="Type a message"
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
          <input type="file" className="mt-2" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}

export default Chat;