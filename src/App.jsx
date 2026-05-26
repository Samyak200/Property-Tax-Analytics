import { useState } from 'react';
import properties from './properties.json';
import { ALL_TENANTS } from './constants/tenants';
import { useTheme } from './hooks/useTheme';
import TenantFilter from './components/TenantFilter';
import ThemeToggle from './components/ThemeToggle';
import AIChatDrawer from './components/AIChatDrawer';
import KPIDashboard from './components/KPIDashboard';
import CollectionChart from './components/CollectionChart';
import StatusBreakdownBar from './components/StatusBreakdownBar';
import './App.css';

export default function App() {
  const [selectedTenant, setSelectedTenant] = useState(ALL_TENANTS);
  const { theme, toggleTheme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__text">
          <p className="app-header__eyebrow">UPYOG Multi-Tenant Platform</p>
          <h1>Property Tax Analytics Dashboard</h1>
          <p className="app-header__subtitle">
            {properties.length.toLocaleString('en-IN')} property records across
            10 Indian cities
          </p>
        </div>
        <div className="app-header__actions">
          <TenantFilter value={selectedTenant} onChange={setSelectedTenant} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="app-main">
        <KPIDashboard records={properties} selectedTenant={selectedTenant} />
        <StatusBreakdownBar
          records={properties}
          selectedTenant={selectedTenant}
        />
        <CollectionChart
          records={properties}
          selectedTenant={selectedTenant}
        />
      </main>

      <footer className="app-footer">
        <p>UPYOG Property Tax Analytics Dashboard</p>
      </footer>

      <button
        type="button"
        className="chat-fab"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open AI assistant"
        title="AI Assistant"
      >
        AI
      </button>
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        records={properties}
      />
    </div>
  );
}
