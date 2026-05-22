// utils/tokenBridge.js

const PARENT_ORIGIN =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://jharvis.com";

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // cross-origin parent exists but can't be accessed = we're in iframe
  }
}

export function getTokenFromParent() {
  if (typeof window === "undefined") return Promise.resolve(null);

  // ── Fallback: not in an iframe, check own localStorage/sessionStorage ──
  if (!isInIframe()) {
    const token =
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("access_token");
    if (token) return Promise.resolve(token);

    console.warn("Not in iframe and no token in storage.");
    return Promise.resolve(null);
  }

  // ── iframe mode: request token from parent via postMessage ──
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("Token request timed out"), 3000);

    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== PARENT_ORIGIN) return;
        if (event.data?.type === "AUTH_TOKEN_RESPONSE") {
          clearTimeout(timeout);
          // Cache it so you don't have to ask again on re-renders
          sessionStorage.setItem("access_token", event.data.token);
          resolve(event.data.token);
        }
      },
      { once: true },
    );

    window.parent.postMessage({ type: "AUTH_TOKEN_REQUEST" }, PARENT_ORIGIN);
  });
}
