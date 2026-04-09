import { useEffect, useRef } from 'react';
import Message from './Message';
import styles from './ChatWindow.module.css';
export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  return (<div className={styles.window}><div className={styles.list}>{messages.map((msg) => (<Message key={msg.id} message={msg} />))}<div ref={bottomRef} /></div></div>);
}
