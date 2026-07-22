import { useState, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BackupsPage = lazy(() => import('./pages/BackupsPage').then(m => ({ default: m.BackupsPage })));
const RestorePage = lazy(() => import('./pages/RestorePage').then(m => ({ default: m.RestorePage })));
const SchedulePage = lazy(() => import('./pages/SchedulePage').then(m => ({ default: m.SchedulePage })));

type Page = 'home' | 'dashboard' | 'backups' | 'restore' | 'schedule';

type NavItem = {
  id: Page;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'backups', label: 'Backups', icon: '💾' },
  { id: 'restore', label: 'Restore', icon: '↻' },
  { id: 'schedule', label: 'Schedule', icon: '🕐' },
];

function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '60px',
      color: 'var(--color-text-secondary)',
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { dark, toggle } = useTheme();

  const handleRestore = () => {
    setCurrentPage('restore');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage as (p: string) => void} onRestore={handleRestore} />;
      case 'backups':
        return <BackupsPage onRestore={handleRestore} />;
      case 'restore':
        return <RestorePage />;
      case 'schedule':
        return <SchedulePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-background)',
    }}>
      <aside style={{
        width: '220px',
        minWidth: '220px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        animation: 'slideInLeft 0.3s ease forwards',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 12px',
          marginBottom: '28px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: '#fff',
          }}>
            💾
          </div>
          <span style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.3px',
          }}>
            BackupBuddy
          </span>
        </div>

        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flex: 1,
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: currentPage === item.id ? 'var(--color-primary-light)' : 'transparent',
                color: currentPage === item.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: currentPage === item.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={e => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = 'var(--color-background)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={e => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{
          padding: '12px',
          borderTop: '1px solid var(--color-border)',
          marginTop: 'auto',
        }}>
          <button
            onClick={toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 400,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-background)';
              e.currentTarget.style.color = 'var(--color-text)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{dark ? '☀️' : '🌙'}</span>
            <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      <main style={{
        flex: 1,
        overflow: 'auto',
        minHeight: '100vh',
      }}>
        <Suspense fallback={<Loading />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
