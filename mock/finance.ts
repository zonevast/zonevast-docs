export interface Transaction {
    id: number;
    desc: string;
    date: string;
    amount: number;
    type: 'credit' | 'debit';
}

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, desc: 'Project Completion Bonus - Urban Threads', date: 'Oct 24, 2023', amount: 1200, type: 'credit' },
    { id: 2, desc: 'Task Reward - Fix Auth Bug', date: 'Oct 22, 2023', amount: 200, type: 'credit' },
    { id: 3, desc: 'Monthly Server Costs', date: 'Oct 01, 2023', amount: -45, type: 'debit' },
    { id: 4, desc: 'Project Milestone - Eco Life', date: 'Sep 28, 2023', amount: 800, type: 'credit' },
];

export const INITIAL_BALANCE = 12450.00;