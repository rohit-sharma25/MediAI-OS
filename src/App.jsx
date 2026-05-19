import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/layout/Dashboard';

function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

export default App;
