import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBudget } from '../context/BudgetContext';
import { Home, Wallet, Plus, CircleDollarSign } from 'lucide-react';

const Sidebar: React.FC = () => {
    const { accounts, addAccount } = useBudget();

    const handleAddAccount = () => {
        const name = prompt('Enter account name:');
        if (name) addAccount(name);
    };

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem 0',
            zIndex: 10
        }}>
            <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CircleDollarSign className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                    YNAB Clone
                </h2>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-hidden">
                <ul style={{ listStyle: 'none' }}>
                    <li>
                        <NavLink to="/budget" style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1.5rem',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                            borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all var(--transition-fast)'
                        })}>
                            <Home size={20} /> Budget
                        </NavLink>
                    </li>

                    <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Accounts</span>
                        <button onClick={handleAddAccount} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                            <Plus size={16} />
                        </button>
                    </div>

                    {accounts.map(acc => (
                        <li key={acc.id}>
                            <NavLink to={`/account/${acc.id}`} style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '0.75rem 1.5rem',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                                borderLeft: isActive ? '4px solid var(--accent-primary)' : '4px solid transparent',
                                transition: 'all var(--transition-fast)'
                            })}>
                                <Wallet size={18} /> {acc.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
