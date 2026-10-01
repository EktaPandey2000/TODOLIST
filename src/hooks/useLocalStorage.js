import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  // setter ke andar hi localStorage me sync write karo
  const setStoredValue = (newValue) => {
    setValue((prev) => {
      const val =
        typeof newValue === "function" ? newValue(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        console.error("localStorage write failed:", e);
      }
      return val;
    });
  };

  // Doosre tabs / user switch ke liye backup sync (optional)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("localStorage sync failed:", e);
    }
  }, [key, value]);

  return [value, setStoredValue];
}

export default useLocalStorage;