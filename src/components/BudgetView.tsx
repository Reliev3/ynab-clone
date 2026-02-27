import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { PlusCircle } from 'lucide-react';

const BudgetView: React.FC = () => {
    const { transactions, categoryGroups, categories, updateCategoryAssigned, addCategoryGroup, addCategory } = useBudget();

    // Calculate Ready to Assign
    const totalInflow = transactions
        .filter(t => t.categoryId === null && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalAssigned = categories.reduce((sum, c) => sum + c.assigned, 0);
    const readyToAssign = totalInflow - totalAssigned;

    const handleAddGroup = () => {
        const name = prompt('Enter category group name:');
        if (name) addCategoryGroup(name);
    };

    const handleAddCategory = (groupId: string) => {
        const name = prompt('Enter category name:');
        if (name) addCategory(groupId, name);
    };

    const getActivity = (categoryId: string) => {
        return transactions
            .filter(t => t.categoryId === categoryId)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    return (
        <div>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center', background: readyToAssign === 0 ? 'var(--success-bg)' : readyToAssign > 0 ? 'var(--bg-glass)' : 'var(--danger-bg)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: readyToAssign >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    ${Math.abs(readyToAssign).toFixed(2)}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '0.5rem' }}>
                    {readyToAssign >= 0 ? 'Ready to Assign' : 'Overassigned'}
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Budget</h2>
                <button onClick={handleAddGroup} className="btn btn-secondary" style={{ display: 'flex', gap: '8px' }}>
                    <PlusCircle size={18} /> Category Group
                </button>
            </div>

            <div className="glass-panel table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                            <th style={{ padding: '1rem 1.5rem', width: '150px' }}>Assigned</th>
                            <th className="table-hidden-mobile" style={{ padding: '1rem 1.5rem', width: '150px' }}>Activity</th>
                            <th style={{ padding: '1rem 1.5rem', width: '150px' }}>Available</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryGroups.map(group => {
                            const groupCats = categories.filter(c => c.groupId === group.id);
                            return (
                                <React.Fragment key={group.id}>
                                    <tr style={{ backgroundColor: 'rgba(51, 65, 85, 0.4)', borderBottom: '1px solid var(--border-color)' }}>
                                        <td colSpan={4} style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {group.name}
                                                <button onClick={() => handleAddCategory(group.id)} style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                                    <PlusCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {groupCats.map(cat => {
                                        const activity = getActivity(cat.id);
                                        const available = cat.assigned + activity;
                                        const availColor = available > 0 ? 'var(--success)' : available < 0 ? 'var(--danger)' : 'var(--text-secondary)';
                                        return (
                                            <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem 1.5rem', paddingLeft: '2.5rem' }}>{cat.name}</td>
                                                <td style={{ padding: '0.5rem 1.5rem' }}>
                                                    <input
                                                        type="number"
                                                        style={{ width: '100px', padding: '0.25rem 0.5rem', textAlign: 'right', backgroundColor: 'var(--bg-tertiary)', border: '1px solid transparent' }}
                                                        value={cat.assigned}
                                                        onChange={(e) => updateCategoryAssigned(cat.id, Number(e.target.value))}
                                                        onFocus={e => e.target.select()}
                                                    />
                                                </td>
                                                <td className="table-hidden-mobile" style={{ padding: '1rem 1.5rem', color: activity < 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                    ${activity.toFixed(2)}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', color: availColor, fontWeight: 600 }}>
                                                    <div style={{ display: 'inline-block', backgroundColor: available > 0 ? 'var(--success-bg)' : available < 0 ? 'var(--danger-bg)' : 'transparent', padding: '4px 12px', borderRadius: '999px', minWidth: '80px', textAlign: 'center' }}>
                                                        ${Math.abs(available).toFixed(2)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetView;
