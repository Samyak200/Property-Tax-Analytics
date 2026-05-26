import { useMemo, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { buildDatasetSummary } from '../utils/aiSummary';
import { askGemini } from '../utils/gemini';

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AIChatDrawer({ isOpen, onClose, records }) {
  const summary = useMemo(() => buildDatasetSummary(records), [records]);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: nowId(),
      role: 'assistant',
      text:
        'Ask me about the property data (e.g. highest collection city, rejected in Mumbai, % approved in Delhi).',
    },
  ]);
  const [input, setInput] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendQuestion(questionOverride) {
    const question = (questionOverride ?? input).trim();
    if (!question || isLoading) return;

    setError('');
    setLastQuestion(question);
    // Clear UI input only for "send from textarea"
    if (!questionOverride) setInput('');

    setMessages((prev) => [
      ...prev,
      { id: nowId(), role: 'user', text: question },
    ]);

    try {
      setIsLoading(true);
      const answer = await askGemini(question, summary);
      setMessages((prev) => [
        ...prev,
        { id: nowId(), role: 'assistant', text: answer },
      ]);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'AI request failed. Please try again.';

      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: nowId(),
          role: 'assistant',
          text: message.includes('Gemini API key missing')
            ? 'Sorry—Gemini API key is missing. Please create/update `.env` with `VITE_GEMINI_API_KEY=...` and restart the dev server.'
            : message.includes('Unauthorized')
              ? 'Sorry—Gemini returned Unauthorized (401). Please verify your API key in `.env`.'
              : message,
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSend() {
    void sendQuestion();
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <>
      <div
        className={`chat-overlay ${isOpen ? 'chat-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`chat-drawer ${isOpen ? 'chat-drawer--open' : ''}`}
        aria-label="AI chat assistant"
        aria-hidden={!isOpen}
      >
        <header className="chat-drawer__header">
          <div className="chat-drawer__title">
            <Bot size={18} aria-hidden="true" />
            <div>
              <p className="chat-drawer__heading">AI Assistant</p>
              <p className="chat-drawer__subheading">Gemini (dataset-aware)</p>
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="chat-drawer__messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`chat-message chat-message--${m.role}`}
            >
              <div className="chat-message__bubble">{m.text}</div>
            </div>
          ))}
          {isLoading ? (
            <div className="chat-message chat-message--assistant">
              <div className="chat-message__bubble chat-message__bubble--typing">
                Thinking…
              </div>
            </div>
          ) : null}
        </div>

        <footer className="chat-drawer__footer">
          {error ? <p className="chat-error">{error}</p> : null}
          {error && lastQuestion && !isLoading ? (
            <div className="chat-retry-row">
              <button
                type="button"
                className="chat-retry"
                onClick={() => sendQuestion(lastQuestion)}
              >
                Retry last question
              </button>
            </div>
          ) : null}
          <div className="chat-input">
            <textarea
              ref={inputRef}
              className="chat-input__field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a question…"
              rows={2}
              disabled={!isOpen}
            />
            <button
              type="button"
              className="chat-input__send"
              onClick={handleSend}
              disabled={!isOpen || isLoading || !input.trim()}
              aria-label="Send"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="chat-hint">
            Tip: Press <kbd>Enter</kbd> to send, <kbd>Esc</kbd> to close.
          </p>
        </footer>
      </aside>
    </>
  );
}

