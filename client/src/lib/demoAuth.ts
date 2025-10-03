// src/lib/demoAuth.ts

const DEMO_AUTH_KEY = "hm_demo_logged_in";

function setLoggedIn(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) localStorage.setItem(DEMO_AUTH_KEY, "1");
  else localStorage.removeItem(DEMO_AUTH_KEY);
}

function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_AUTH_KEY) === "1";
}

export { isLoggedIn, setLoggedIn, DEMO_AUTH_KEY };
