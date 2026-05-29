import { useEffect, useState } from 'react';
import { jobsAPI } from '../../services/api';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/format';

export default function JobMessageThread({ jobId, canMessage }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    jobsAPI
      .getMessages(jobId)
      .then(({ data }) => setMessages(data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [jobId]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await jobsAPI.sendMessage(jobId, text.trim());
      setText('');
      showToast('Message sent', 'success');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="job-messages-panel">
      <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#864000' }}>Messages</h4>
      {loading ? (
        <p style={{ fontSize: 14, color: '#666' }}>Loading messages…</p>
      ) : (
        <div className="job-messages-list">
          {!messages.length ? (
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m._id} className="job-message-item">
                <strong>{m.senderRole === 'worker' ? 'Worker' : 'Client'}</strong>
                {m.senderId?.name ? ` (${m.senderId.name})` : ''}: {m.message}
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {formatDate(m.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {canMessage && (
        <form className="job-message-form" onSubmit={send}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !text.trim()}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
}
