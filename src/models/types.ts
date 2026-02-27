export interface Account {
    id: string;
    name: string;
}

export interface CategoryGroup {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    groupId: string;
    name: string;
    assigned: number;
}

export interface Transaction {
    id: string;
    accountId: string;
    categoryId: string | null; // null indicates 'Inflow: Ready to Assign'
    date: string;
    payee: string;
    amount: number; // positive for income, negative for expenses
    memo: string;
}

export interface AppState {
    accounts: Account[];
    categoryGroups: CategoryGroup[];
    categories: Category[];
    transactions: Transaction[];
}
