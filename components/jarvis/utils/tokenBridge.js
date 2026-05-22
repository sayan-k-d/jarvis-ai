// tokenBridge.js
export function getTokenFromParent() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("Token request timed out"), 3000);

    window.addEventListener(
      "message",
      (event) => {
        // IMPORTANT: always validate origin
        if (event.origin !== "https://jharvis.com") return; // or http://localhost:3000

        if (event.data?.type === "AUTH_TOKEN_RESPONSE") {
          clearTimeout(timeout);
          resolve(event.data.token);
        }
      },
      { once: true },
    );

    // Ask the parent (jharvis.com) for the token
    window.parent.postMessage(
      { type: "AUTH_TOKEN_REQUEST" },
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://jharvis.com",
    );
  });
}
