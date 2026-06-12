// chatService.js

// Dynamic Base URL mapping based on environment hostname
const getBaseUrl = () => {
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  return isLocal
    ? "https://n8n.srv1375926.hstgr.cloud/webhook/62430e45-1007-4638-9c42-9bdffe84886b"
    : "https://n8n.srv1375926.hstgr.cloud/webhook/62430e45-1007-4638-9c42-9bdffe84886b";
};

const API_BASE_URL = getBaseUrl();

// Retrieve or create a stable session ID for this browser session.
// A new ID is generated each time the tab/window is opened fresh.
const getSessionId = () => {
  const KEY = "jarvis_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
};

/**
 * Sends a user message to the chat API and returns the bot's text response.
 * @param {string} message - The question or message from the user.
 * @returns {Promise<string>} The string response from the AI.
 */
const FALLBACK_MESSAGE = "No response received from the server.";
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendChatMessage = async (message) => {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: getSessionId() }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const text = await response.text();
      if (!text || !text.trim()) {
        throw new Error("Empty response body");
        // return FALLBACK_MESSAGE;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON in response");
      }

      if (data.output) return data.output;

      throw new Error("Missing output field in response");
    } catch (error) {
      lastError = error;
      console.warn(
        `API attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        error.message,
      );

      if (attempt < MAX_ATTEMPTS) await delay(RETRY_DELAY_MS);
    }
  }

  console.error("All API attempts exhausted:", lastError);
  return FALLBACK_MESSAGE;
};
