import { useState, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import styles from './App.module.css';

const WELCOME = { id: 'welcome', role: 'assistant', content: 'Olá! Sou seu assistente virtual. Como posso ajudar você hoje?' };

export default function App() {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', content: text };
    const history = [...messages.filter((m) => m.id !== 'welcome'), userMsg];
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const placeholderId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: placeholderId, role: 'assistant', content: '', streaming: true }]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) setMessages((prev) => prev.map((m) => m.id === placeholderId ? { ...m, content: m.content + parsed.text } : m));
          } catch {}
        }
      }
      setMessages((prev) => prev.map((m) => m.id === placeholderId ? { ...m, streaming: false } : m));
    } catch (err) {
      if (err.name !== 'AbortError') setMessages((prev) => prev.map((m) => m.id === placeholderId ? { ...m, content: 'Erro ao obter resposta. Tente novamente.', streaming: false, error: true } : m));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}><span className={styles.logoIcon}>✦</span><span>Assistente IA</span></div>
          <button className={styles.clearBtn} onClick={() => { abortRef.current?.abort(); setMessages([WELCOME]); setLoading(false); }}>Nova conversa</button>
        </div>
      </header>
      <main className={styles.main}><ChatWindow messages={messages} /></main>
      <footer className={styles.footer}>
        <InputBar onSend={sendMessage} onStop={() => abortRef.current?.abort()} loading={loading} />
        <p className={styles.disclaimer}>Respostas geradas por IA — verifique informações importantes.</p>
      </footer>
    </div>
  );
}
