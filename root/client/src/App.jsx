import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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
    <Router>
      <AppProviders>
        <MainApp />
      </AppProviders>
    </Router>
  );
}

export default App;