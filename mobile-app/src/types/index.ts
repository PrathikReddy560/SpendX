// Types Barrel Export
// Add shared TypeScript types and interfaces here

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    budget?: number;
    spent?: number;
}
