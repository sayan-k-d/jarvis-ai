// utils/tokenBridge.js

const PARENT_ORIGIN =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://jharvis.com";

export function getTokenFromParent() {
  if (typeof window === "undefined") return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("Token request timed out"), 3000);

    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== PARENT_ORIGIN) return; // ✅ dynamic origin check
        if (event.data?.type === "AUTH_TOKEN_RESPONSE") {
          clearTimeout(timeout);
          resolve(event.data.token);
        }
      },
      { once: true },
    );

    window.parent.postMessage({ type: "AUTH_TOKEN_REQUEST" }, PARENT_ORIGIN); // ✅ same variable
  });
}
