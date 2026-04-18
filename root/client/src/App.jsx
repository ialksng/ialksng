import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppProviders from './app/AppProviders';
import MainApp from './apps/main/MainApp';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
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