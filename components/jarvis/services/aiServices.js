// chatService.js

// Dynamic Base URL mapping based on environment hostname
const getBaseUrl = () => {
  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  return isLocal
    ? "http://168.231.102.73:7000" // Yields http://168.231.102.73:7000/chat in fetch below
    : "https://e991-2a02-4780-12-a2af-00-1.ngrok-free.app";
};

const API_BASE_URL = getBaseUrl();

/**
 * Sends a user message to the chat API and returns the bot's text response.
 * @param {string} message - The question or message from the user.
 * @returns {Promise<string>} The string response from the AI.
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Fallback to a default string if data.response is missing
    return data.response || "No response received from the server.";
  } catch (error) {
    console.error("API Service Error:", error);
    throw error; // Rethrow the error so the component knows something went wrong
  }
};
