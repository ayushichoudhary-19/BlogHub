export const getCache = (key, maxAge = 60000) => {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    const { value, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > maxAge) {
      sessionStorage.removeItem(key);
      return null;
    }
    return value;
  } catch (e) {
    console.warn("Invalid cache format for key:", key);
    sessionStorage.removeItem(key);
    return null;
  }
};

export const setCache = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
};
