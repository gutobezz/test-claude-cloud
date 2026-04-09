import { useState, useRef, useEffect } from 'react';
import styles from './InputBar.module.css';
export default function InputBar({ onSend, onStop, loading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [text]);
  const submit = () => { if (!text.trim() || loading) return; onSend(text); setText(''); };
  return (
    <div className={styles.bar}>
      <textarea ref={textareaRef} className={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} placeholder="Digite sua mensagem… (Enter para enviar, Shift+Enter para nova linha)" rows={1} disabled={loading} />
      <div className={styles.actions}>
        {loading
          ? <button className={`${styles.btn} ${styles.stopBtn}`} onClick={onStop}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg></button>
          : <button className={`${styles.btn} ${styles.sendBtn}`} onClick={submit} disabled={!text.trim()}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></button>
        }
      </div>
    </div>
  );
}
