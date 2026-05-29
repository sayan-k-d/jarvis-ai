// chatService.js
const API_BASE_URL = "https://e991-2a02-4780-12-a2af-00-1.ngrok-free.app";

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
