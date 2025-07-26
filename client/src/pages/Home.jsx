import { useState, useEffect } from 'react';
import Login from '../components/Login';
import Chat from '../components/Chat';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <div>{user ? <Chat user={user} /> : <Login setUser={setUser} />}</div>
  );
}

export default Home;