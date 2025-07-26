import { SocketContext } from './context/SocketContext';
import Home from './pages/Home';
import socket from './socket/socket';
import './App.css';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Home />
    </SocketContext.Provider>
  );
}

export default App;