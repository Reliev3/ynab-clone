import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Account, CategoryGroup, Category, Transaction, AppState } from '../models/types';
import { supabase } from '../lib/supabase';

interface BudgetContextType extends AppState {
    addAccount: (name: string) => Promise<void>;
    addCategoryGroup: (name: string) => Promise<void>;
    addCategory: (groupId: string, name: string) => Promise<void>;
    updateCategoryAssigned: (categoryId: string, amount: number) => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    isLoading: boolean;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [accRes, cgRes, catRes, txnRes] = await Promise.all([
                supabase.from('accounts').select('*'),
                supabase.from('category_groups').select('*'),
                supabase.from('categories').select('*'),
                supabase.from('transactions').select('*')
            ]);

            if (accRes.data) setAccounts(accRes.data as Account[]);
            if (cgRes.data) setCategoryGroups(cgRes.data as CategoryGroup[]);
            // map group_id to groupId from db
            if (catRes.data) setCategories(catRes.data.map((c: any) => ({ ...c, groupId: c.group_id })) as Category[]);
            // map account_id and category_id
            if (txnRes.data) setTransactions(txnRes.data.map((t: any) => ({ ...t, accountId: t.account_id, categoryId: t.category_id })) as Transaction[]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addAccount = async (name: string) => {
        const { data, error } = await supabase.from('accounts').insert([{ name }]).select().single();
        if (!error && data) setAccounts([...accounts, data as Account]);
    };

    const addCategoryGroup = async (name: string) => {
        const { data, error } = await supabase.from('category_groups').insert([{ name }]).select().single();
        if (!error && data) setCategoryGroups([...categoryGroups, data as CategoryGroup]);
    };

    const addCategory = async (groupId: string, name: string) => {
        const { data, error } = await supabase.from('categories').insert([{ group_id: groupId, name, assigned: 0 }]).select().single();
        if (!error && data) setCategories([...categories, { ...data, groupId: data.group_id } as Category]);
    };

    const updateCategoryAssigned = async (categoryId: string, amount: number) => {
        // Optimistic UI update
        setCategories(categories.map(c => c.id === categoryId ? { ...c, assigned: amount } : c));
        await supabase.from('categories').update({ assigned: amount }).eq('id', categoryId);
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const payload = {
            account_id: transaction.accountId,
            category_id: transaction.categoryId,
            date: transaction.date,
            payee: transaction.payee,
            amount: transaction.amount,
            memo: transaction.memo
        };
        const { data, error } = await supabase.from('transactions').insert([payload]).select().single();
        if (!error && data) setTransactions([...transactions, { ...data, accountId: data.account_id, categoryId: data.category_id } as Transaction]);
    };

    return (
        <BudgetContext.Provider value={{
            accounts,
            categoryGroups,
            categories,
            transactions,
            addAccount,
            addCategoryGroup,
            addCategory,
            updateCategoryAssigned,
            addTransaction,
            isLoading
        }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
