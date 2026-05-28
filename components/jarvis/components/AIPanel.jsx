import { useState, useEffect, useRef, useCallback } from "react";
import { aiResponses } from "../data/staticData.js";
import { getDynamicAiResponse } from "../utils/helpers.js";
import { sendChatMessage } from "../services/aiServices.js";

export default function AIPanel({
  isOpen,
  onToggle,
  externalQuestion,
  stocksData,
}) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Good morning, Noland! I'm Jarvis, your AI investment intelligence assistant. I have access to all 4 AI engines:",
      chips: [
        {
          label: "Market Summary",
          icon: "fa-globe",
          q: "Give me a market summary",
        },
        {
          label: "Portfolio Analysis",
          icon: "fa-brain",
          q: "Analyze my portfolio performance",
        },
        {
          label: "Opportunities",
          icon: "fa-lightbulb",
          q: "What are the best opportunities right now?",
        },
        {
          label: "Risk Assessment",
          icon: "fa-shield-alt",
          q: "What are the main risks in my portfolio?",
        },
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef(null);

  const scrollBottom = () => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  // const ask = useCallback(
  //   (question) => {
  //     if (!isOpen) onToggle();
  //     setMessages((prev) => [...prev, { type: "user", content: question }]);
  //     setIsTyping(true);
  //     setTimeout(() => {
  //       const response =
  //         aiResponses[question] ||
  //         getDynamicAiResponse(question, stocksData || []);
  //       setIsTyping(false);
  //       setMessages((prev) => [...prev, { type: "bot", content: response }]);
  //     }, 1200);
  //   },
  //   [isOpen, onToggle, stocksData],
  // );
  const ask = useCallback(
    async (question) => {
      // 1. UI updates: Open chat window if closed
      if (!isOpen) onToggle();

      // 2. Optimistically add user message and trigger loader
      setMessages((prev) => [...prev, { type: "user", content: question }]);
      setIsTyping(true);

      try {
        // 3. Call the external service
        const botResponse = await sendChatMessage(question);

        // 4. Update state with successful backend response
        setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);
      } catch (error) {
        // 5. Handle fallback messaging in case of failure
        console.log(error);

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content:
              "Sorry, I'm having trouble connecting to the server right now.",
          },
        ]);
      } finally {
        // 6. Ensure typing loader turns off regardless of success or failure
        setIsTyping(false);
      }
    },
    [isOpen, onToggle], // Removed 'stocksData' since the backend now manages the data fetching
  );
  useEffect(() => {
    const askAi = async () => {
      ask(externalQuestion);
    };
    if (externalQuestion) askAi();
    // eslint-disable-next-line
  }, [externalQuestion]);

  useEffect(() => {
    scrollBottom();
  }, [messages, isTyping]);

  const send = () => {
    if (inputVal.trim()) {
      ask(inputVal.trim());
      setInputVal("");
    }
  };

  return (
    <div className={`ai-panel${isOpen ? " open" : ""}`} id="aiPanel">
      <div className="ai-header">
        <div className="ai-avatar">
          <i className="fas fa-robot"></i>
        </div>
        <div className="ai-info">
          <h3>Jarvis AI</h3>
          <span>Online</span>
        </div>
        <div className="ai-header-actions">
          <button className="ai-header-btn" onClick={onToggle} title="Minimize">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="ai-messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`ai-message ${msg.type}`}>
            <div className="message-bubble">
              <span
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\n/g, "<br/>"),
                }}
              />
              {msg.chips && (
                <div className="ai-suggestions" style={{ marginTop: 12 }}>
                  {msg.chips.map((chip) => (
                    <span
                      key={chip.q}
                      className="suggestion-chip"
                      onClick={() => ask(chip.q)}
                    >
                      <i className={`fas ${chip.icon}`}></i> {chip.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="ai-message bot">
            <div className="message-bubble">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 0.16, 0.32].map((delay, i) => (
                    <div
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        background: "var(--accent-cyan)",
                        borderRadius: "50%",
                        animation: `bounce 1.4s infinite ease-in-out ${delay}s both`,
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: "0.7em", color: "var(--text-muted)" }}>
                  Jarvis is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ai-input">
        <div className="input-container">
          <input
            type="text"
            id="aiInput"
            placeholder="Ask about markets, stocks, risks, or opportunities..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <div className="input-actions">
            <button>
              <i className="fas fa-microphone"></i>
            </button>
            <button className="send-btn" onClick={send}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
