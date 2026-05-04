// components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

function ChatBot({ currentUser, posts, users }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${currentUser?.username || 'there'}! I'm your ContentFlow assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    setError(null);
    setInput('');

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    const assistantMsg = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsStreaming(true);

    // AbortController so closing the chat cancels in-flight requests
    const controller = new AbortController();
    abortRef.current = controller;

    // Build session context for the server-side system prompt
    const context = {
      username: currentUser?.username,
      role: currentUser?.role ?? 'editor',
      postCount: posts?.length ?? 0,
      userCount: users?.length ?? 0,
    };

    // Send only role + content to the API (strip any UI-only fields)
    const apiMessages = updatedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, context }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed with status ${response.status}`);
      }

      // Parse Server-Sent Events stream from Groq (OpenAI-compatible format)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by newlines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep last incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + delta,
                };
                return updated;
              });
            }
          } catch {
            // Ignore malformed chunks; streams sometimes split mid-JSON
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
          };
          return updated;
        });
        setError(err.message || 'Request failed.');
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleClose() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setIsOpen(false);
  }

  function clearChat() {
    setMessages([
      {
        role: 'assistant',
        content: `Hi ${currentUser?.username || 'there'}! I'm your ContentFlow assistant. How can I help you today?`,
      },
    ]);
    setError(null);
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="chatbot-panel"
          role="dialog"
          aria-label="Chat assistant"
          aria-modal="false"
        >
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <Bot size={18} />
              <span>ContentFlow Assistant</span>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-clear-btn"
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                className="chatbot-close-btn"
                onClick={handleClose}
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages" aria-live="polite" aria-atomic="false">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.role === 'user' ? 'user' : 'assistant'}`}
              >
                <div className="chatbot-bubble">
                  {msg.content || (isStreaming && i === messages.length - 1 ? (
                    <span className="chatbot-cursor" aria-label="Thinking">▋</span>
                  ) : null)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="chatbot-error" role="alert">
              {error}
            </div>
          )}

          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              className="chatbot-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              rows={1}
              disabled={isStreaming}
              aria-label="Chat message input"
            />
            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
