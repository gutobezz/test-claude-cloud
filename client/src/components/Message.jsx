import ReactMarkdown from 'react-markdown';
import styles from './Message.module.css';
export default function Message({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : styles.assistantRow}`}>
      {!isUser && <div className={styles.avatar}>✦</div>}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble} ${message.error ? styles.errorBubble : ''}`}>
        {isUser ? <p className={styles.text}>{message.content}</p> : <div className={styles.markdown}><ReactMarkdown>{message.content || ' '}</ReactMarkdown>{message.streaming && <span className={styles.cursor} />}</div>}
      </div>
      {isUser && <div className={`${styles.avatar} ${styles.userAvatar}`}>U</div>}
    </div>
  );
}
