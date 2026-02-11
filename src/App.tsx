import { useState, useEffect } from 'react';
import './App.css';
import { UserGenerator } from './components/UserGenerator';
import { AdminPanel } from './components/AdminPanel';
import { PasswordGuard } from './components/PasswordGuard';
import { loadConfigAsync } from './lib/storage';
import { translations } from './lib/translations';

function App() {
  const [page, setPage] = useState<'user' | 'admin'>('user');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    loadConfigAsync().then((config) => {
      setAdminPassword(config.adminPassword);
    });
  }, []);

  return (
    <>
      {page === 'user' && (
        <>
          <UserGenerator />
          <footer className="fixed bottom-4 right-4 text-xs text-gray-500">
            <button
              onClick={() => {
                setPage('admin');
                setAdminAuthenticated(false);
              }}
              className="text-gray-400 hover:text-red-500 underline transition-colors"
            >
              {translations.app.admin}
            </button>
          </footer>
        </>
      )}

      {page === 'admin' && !adminAuthenticated && (
        <PasswordGuard
          correctPassword={adminPassword}
          onAuthenticated={() => setAdminAuthenticated(true)}
        />
      )}

      {page === 'admin' && adminAuthenticated && (
        <AdminPanel
          onLogout={() => {
            setAdminAuthenticated(false);
            setPage('user');
          }}
        />
      )}
    </>
  );
}

export default App;
