import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBudget } from '../context/BudgetContext';
import TransactionModal from './TransactionModal';

const AccountView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { accounts, transactions, categories, addTransaction } = useBudget();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const account = accounts.find(a => a.id === id);
    const accountTransactions = transactions.filter(t => t.accountId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!account) return <div>Account not found</div>;

    const balance = accountTransactions.reduce((sum, t) => sum + t.amount, 0);

    const handleSaveTransaction = (payload: any) => {
        addTransaction({
            accountId: account.id,
            categoryId: payload.categoryId,
            date: payload.date,
            payee: payload.payee,
            amount: payload.amount,
            memo: payload.memo
        });
        setIsModalOpen(false);
    };

    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return 'Inflow: Ready to Assign';
        return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{account.name}</h1>
                    <p style={{ fontSize: '1.25rem', color: balance >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        ${Math.abs(balance).toFixed(2)} Balance
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add Transaction</button>
            </div>

            <div className="glass-panel table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                            <th style={{ padding: '1rem 1.5rem' }}>Payee</th>
                            <th className="table-hidden-mobile" style={{ padding: '1rem 1.5rem' }}>Category</th>
                            <th className="table-hidden-mobile" style={{ padding: '1rem 1.5rem' }}>Memo</th>
                            <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No transactions found for this account.
                                </td>
                            </tr>
                        ) : accountTransactions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{t.payee}</td>
                                <td className="table-hidden-mobile" style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                        {getCategoryName(t.categoryId)}
                                    </span>
                                </td>
                                <td className="table-hidden-mobile" style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{t.memo}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 600, color: t.amount > 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                                    {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <TransactionModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransaction}
                />
            )}
        </div>
    );
};

export default AccountView;
