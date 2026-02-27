import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { X } from 'lucide-react';

interface TransactionModalProps {
    onClose: () => void;
    onSave: (payload: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ onClose, onSave }) => {
    const { categories, categoryGroups } = useBudget();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [payee, setPayee] = useState('');
    const [categoryId, setCategoryId] = useState<string | ''>('');
    const [memo, setMemo] = useState('');
    const [outflow, setOutflow] = useState('');
    const [inflow, setInflow] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const outVal = parseFloat(outflow) || 0;
        const inVal = parseFloat(inflow) || 0;
        const amount = inVal > 0 ? inVal : -outVal;

        onSave({
            date,
            payee,
            categoryId: categoryId === '' ? null : categoryId,
            memo,
            amount
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}>
                    <X size={24} />
                </button>
                <h2 style={{ marginBottom: '1.5rem' }}>Add Transaction</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Payee</label>
                        <input type="text" value={payee} onChange={e => setPayee(e.target.value)} required placeholder="Who did you pay/receive money from?" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Category</label>
                        <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value="">Inflow: Ready to Assign</option>
                            {categoryGroups.map(group => (
                                <optgroup key={group.id} label={group.name}>
                                    {categories.filter(c => c.groupId === group.id).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Memo</label>
                        <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="Optional note" />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Outflow</label>
                            <input type="number" step="0.01" min="0" value={outflow} onChange={e => { setOutflow(e.target.value); setInflow(''); }} placeholder="Spent" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Inflow</label>
                            <input type="number" step="0.01" min="0" value={inflow} onChange={e => { setInflow(e.target.value); setOutflow(''); }} placeholder="Received" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
