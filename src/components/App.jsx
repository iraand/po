import React from 'react';
import AdminPage from './AdminPage';
import Provider from '../context';

export default function App() {
  return (
    <Provider>
      <AdminPage />
    </Provider>
  );
}
