import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import { LogIn, MessageCircle, RefreshCw, Send, Server, UserPlus, Wifi } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const SERVER_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

const demoMessages = [
  { id: 1, from: 'Alex', text: 'Design handoff is ready for review.', mine: false },
  { id: 2, from: 'You', text: 'Great, I will connect the API status panel first.', mine: true },
  { id: 3, from: 'Sam', text: 'Auth endpoints are available when MongoDB is running.', mine: false }
];

function App() {
  const [status, setStatus] = useState({ label: 'Checking', detail: 'Contacting backend...' });
  const [messages, setMessages] = useState(demoMessages);
  const [draft, setDraft] = useState('');
  const [socketState, setSocketState] = useState('offline');
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [response, setResponse] = useState('');

  const socket = useMemo(() => io(SERVER_URL, { autoConnect: false }), []);

  const checkHealth = async () => {
    setStatus({ label: 'Checking', detail: 'Contacting backend...' });
    try {
      const result = await fetch(`${SERVER_URL}/health`);
      const data = await result.json();
      setStatus({ label: 'Online', detail: `${data.status} at ${new Date(data.timestamp).toLocaleTimeString()}` });
    } catch (error) {
      setStatus({ label: 'Offline', detail: 'Start the backend on port 3000' });
    }
  };

  useEffect(() => {
    checkHealth();

    socket.connect();
    socket.on('connect', () => setSocketState('connected'));
    socket.on('disconnect', () => setSocketState('offline'));
    socket.on('message_received', (message) => {
      setMessages((current) => [
        ...current,
        { id: message.id || Date.now(), from: message.sender || 'Realtime', text: message.content || message.text, mine: false }
      ]);
    });

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, [socket]);

  const sendLocalMessage = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const message = { id: Date.now(), from: 'You', text, mine: true };
    setMessages((current) => [...current, message]);
    socket.emit('new_message', { chatId: 'demo', message: { content: text, sender: 'You' } });
    setDraft('');
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setResponse('Sending request...');
    const path = authMode === 'login' ? 'login' : 'register';
    const body = authMode === 'login'
      ? { email: form.email, password: form.password }
      : form;

    try {
      const result = await fetch(`${API_URL}/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await result.json();
      setResponse(data.message || data.error || JSON.stringify(data));
    } catch (error) {
      setResponse('Could not reach the backend auth endpoint.');
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <MessageCircle size={28} />
          <div>
            <h1>BlueChat</h1>
            <p>Workspace messenger</p>
          </div>
        </div>

        <section className="panel">
          <div className="panel-title">
            <Server size={18} />
            <span>Backend</span>
            <button className="icon-button" onClick={checkHealth} aria-label="Refresh backend status">
              <RefreshCw size={16} />
            </button>
          </div>
          <strong className={`status ${status.label.toLowerCase()}`}>{status.label}</strong>
          <p>{status.detail}</p>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Wifi size={18} />
            <span>Realtime</span>
          </div>
          <strong className={`status ${socketState}`}>{socketState}</strong>
          <p>Socket target: {SERVER_URL}</p>
        </section>
      </aside>

      <section className="chat-surface">
        <header className="chat-header">
          <div>
            <h2>Design Team</h2>
            <p>Demo room connected to the Socket.io server when it is running.</p>
          </div>
        </header>

        <div className="message-list">
          {messages.map((message) => (
            <article className={`message ${message.mine ? 'mine' : ''}`} key={message.id}>
              <span>{message.from}</span>
              <p>{message.text}</p>
            </article>
          ))}
        </div>

        <form className="composer" onSubmit={sendLocalMessage}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message" />
          <button type="submit" aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </section>

      <aside className="auth-panel">
        <div className="auth-tabs">
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')} type="button">
            <LogIn size={16} />
            Login
          </button>
          <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')} type="button">
            <UserPlus size={16} />
            Register
          </button>
        </div>

        <form onSubmit={submitAuth} className="auth-form">
          {authMode === 'register' && (
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Username" />
          )}
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" type="email" />
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" type="password" />
          <button type="submit">{authMode === 'login' ? 'Login' : 'Create account'}</button>
        </form>

        {response && <p className="response">{response}</p>}
      </aside>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
