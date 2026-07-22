import { useState, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';
import { LicenseProvider, useLicense } from './licensing/LicenseProvider';
import { AnimatedBackground } from './components/AnimatedBackground';

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
  return <LicenseProvider productKey="BackupBuddy"><AppInner /></LicenseProvider>;
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { isPro, loading: proLoading, setShowProModal } = useLicense();

  const handleRestore = () => {
    setCurrentPage('restore');
    setMobileMenuOpen(false);
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
    <>
      <AnimatedBackground />
      <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"
        style={{ position: 'fixed', top: '0.75rem', left: '0.75rem', zIndex: 110, display: 'none', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
          )}
        </svg>
      </button>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-background)',
        position: 'relative',
        zIndex: 1,
      }}>
        {mobileMenuOpen && (
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
            className="mobile-overlay" />
        )}
        <aside className={'sidebar-nav' + (mobileMenuOpen ? ' open' : '')} style={{
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
          {!proLoading && (
            <span style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              padding: '0.125rem 0.375rem',
              borderRadius: 'var(--radius-sm)',
              background: isPro ? 'var(--color-success-light)' : 'var(--color-warning-light)',
              color: isPro ? 'var(--color-success)' : 'var(--color-warning)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {isPro ? 'Pro' : 'Free'}
            </span>
          )}
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
              onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
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
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {!isPro && (
            <button
              onClick={() => setShowProModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'var(--color-primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%',
              }}
            >
              <span>⭐</span>
              Upgrade to Pro
            </button>
          )}

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
    </>
  );
}
