import React from 'react';
import AuthWrapper from './components/auth/AuthWrapper';
import InfluenceFlowDashboard from './components/influence-flow/InfluenceFlowDashboard';

function App() {
  return (
    <AuthWrapper>
      <InfluenceFlowDashboard />
    </AuthWrapper>
  );
}

export default App;