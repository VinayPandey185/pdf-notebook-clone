import React, { useState } from "react";

function Chat({ setCurrentPage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input.trim() })
      });
      const data = await res.json();

      const botMsg = { sender: 'bot', text: data.answer, page: data.page };
      setMessages(prev => [...prev, botMsg]);

      if (data.page) {
        setCurrentPage(data.page);
      }

    } catch (err) {
      console.error('Chat error:', err);
    }

    setInput('');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "8px", textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: msg.sender === 'user' ? "#4A90E2" : "#eee",
                color: msg.sender === 'user' ? "white" : "black",
                maxWidth: "80%",
                wordWrap: "break-word"
              }}
            >
              {msg.text}
            </span>
            {/* Citation button */}
            {msg.page && msg.sender === 'bot' && (
              <button
                style={{ marginLeft: "8px" }}
                onClick={() => setCurrentPage(msg.page)}
              >
                Go to page {msg.page}
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "10px", borderTop: "1px solid #ccc", display: "flex" }}>
        <input
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          style={{ marginLeft: "5px", padding: "8px 12px", background: "#4A90E2", color: "white", border: "none", borderRadius: "4px" }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
