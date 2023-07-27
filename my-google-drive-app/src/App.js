import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import RevokePage from './RevokePage';
import AnalyticsPage from './AnalyticsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/revoke-access" element={<RevokePage />} />
      </Routes>

    </Router>
  );
};

export default App;
