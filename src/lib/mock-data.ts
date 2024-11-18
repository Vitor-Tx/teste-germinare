import { Transaction } from './types';
import fullTransactions from '@/app/api/data/partial_data.json'


export const mockTransactionsTest: Transaction[] = [
  {
    date: '2024-03-20T10:30:00Z',
    amount: 5565,
    transaction_type: 'deposit',
    currency: 'BRL',
    account: 'Main Account',
    industry: 'Tecnologia',
    state: 'SP'
  },
  {
    date: '2024-03-19T15:45:00Z',
    amount: 12340,
    transaction_type: 'withdraw',
    currency: 'BRL',
    account: 'Savings',
    industry: 'Varejo',
    state: 'RJ'
  },
  {
    date: '2024-03-18T09:15:00Z',
    amount: 89990,
    transaction_type: 'deposit',
    currency: 'BRL',
    account: 'Investment',
    industry: 'Turismo',
    state: 'MG'
  }
];

export const mockTransactions: Transaction[] = (fullTransactions as Transaction[]);