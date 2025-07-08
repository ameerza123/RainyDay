import React from 'react';
import { AuthProvider } from './src/services/AuthContext'
import AppNavigator from './src/services/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
