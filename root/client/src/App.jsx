import React, { useEffect } from 'react';
import AppProviders from './app/AppProviders';
import MainApp from './apps/main/MainApp';

function App() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
    } catch (error) {
      console.error("Theme toggle error:", error);
    }
  }, []);

  return (
    <AppProviders>
      <MainApp />
    </AppProviders>
  );
}

export default App;