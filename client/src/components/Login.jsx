import { useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

function Login({ setUser }) {
  const socket = useContext(SocketContext);
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setUser({ username });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Join Chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-2 border rounded-lg mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default Login;