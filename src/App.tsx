import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BudgetProvider } from './context/BudgetContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import BudgetView from './components/BudgetView';
import AccountView from './components/AccountView';

function App() {
  return (
    <BudgetProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
          <div className="desktop-only" style={{ display: 'flex' }}>
            <Sidebar />
          </div>
          <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <Routes>
                <Route path="/budget" element={<BudgetView />} />
                <Route path="/account/:id" element={<AccountView />} />
                <Route path="/" element={<Navigate to="/budget" replace />} />
              </Routes>
            </div>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </BudgetProvider>
  );
}

export default App;
