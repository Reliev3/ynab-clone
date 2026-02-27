import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBudget } from '../context/BudgetContext';
import { Home, Wallet } from 'lucide-react';

const BottomNav: React.FC = () => {
    const { accounts } = useBudget();
    // On mobile, maybe we just link to a generic accounts list, or the first account, 
    // but for simplicity let's link to the first account if it exists, or a general accounts page if we had one.
    const firstAccountId = accounts.length > 0 ? accounts[0].id : '';

    return (
        <nav className="mobile-flex" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'none', // Overridden by .mobile-flex
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)' // For iPhone home bar
        }}>
            <NavLink to="/budget" style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400,
                textDecoration: 'none'
            })}>
                <Home size={24} />
                <span>Budget</span>
            </NavLink>

            {firstAccountId && (
                <NavLink to={`/account/${firstAccountId}`} style={({ isActive }) => ({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none'
                })}>
                    <Wallet size={24} />
                    <span>Accounts</span>
                </NavLink>
            )}
        </nav>
    );
};

export default BottomNav;
