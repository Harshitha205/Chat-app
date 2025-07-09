import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "coffee", // Default theme (will be set initially by App.jsx useEffect)
  setTheme: (theme) => {
    // This function simply updates the state in the store.
    // The actual DOM attribute update is handled by the useEffect in App.jsx.
    set({ theme });
    console.log('Theme updated in store:', theme);
  },
}));

// The THEMES array can live here if it's convenient for your SettingsPage
export const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset"
];