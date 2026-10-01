import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "tm_users";
const CURRENT_KEY = "tm_current_user";

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const writeUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_KEY);
  }, [user]);

  const register = ({ username, email, password }) => {
    const users = readUsers();
    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists)
      return { ok: false, error: "Username or email already exists" };

    const newUser = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toLocaleString(),
    };
    users.push(newUser);
    writeUsers(users);
    setUser({
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
    return { ok: true };
  };

  const login = ({ username, password }) => {
    const users = readUsers();
    const found = users.find(
      (u) =>
        (u.username.toLowerCase() === username.toLowerCase() ||
          u.email.toLowerCase() === username.toLowerCase()) &&
        u.password === password
    );
    if (!found) return { ok: false, error: "Invalid credentials" };

    setUser({
      username: found.username,
      email: found.email,
      createdAt: found.createdAt,
    });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const deleteAccount = () => {
    if (!user) return;
    const users = readUsers().filter((u) => u.username !== user.username);
    writeUsers(users);
    localStorage.removeItem(`todolist_${user.username}`);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        deleteAccount,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}