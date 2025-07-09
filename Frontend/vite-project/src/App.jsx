import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore"; // Import useThemeStore

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore(); // Get theme and setTheme from the store

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // NEW: Effect to apply the theme to the document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // You can also add a localStorage check here to persist the theme
    // const savedTheme = localStorage.getItem('chatty-theme');
    // if (savedTheme && savedTheme !== theme) {
    //   setTheme(savedTheme); // Set initial theme from localStorage if different
    // }
  }, [theme, setTheme]); // Re-run if theme state changes

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    // The data-theme attribute on this div is technically redundant if applied to document.documentElement
    // But keeping it here for older versions of DaisyUI or if you change root.
    // However, applying to document.documentElement is the standard.
    <div data-theme={theme} className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/chat/:userId" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
};

export default App;