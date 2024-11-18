import type { Transaction } from '@/lib/types';
import { promises as fs } from 'fs';
import path from 'path';
import { subDays } from "date-fns"
import { unstable_cache } from 'next/cache';
import { currencySymbols, convertToBRL } from './utils';

export const getTransactionData = unstable_cache(async () => {
  'use server'
  const dataPath = process.env.NEXT_PUBLIC_API_DATA_URL;
  //const filePath = path.join(dataPath ?? '', 'ordered_data.json');
  const resolvedPath = path.resolve(dataPath + '/ordered_data.json')
  const jsonData = await fs.readFile(resolvedPath, 'utf-8');
  const data: Transaction[] = JSON.parse(jsonData);
  const now = new Date();
  const convertedData = data.map(transaction => {
    const transactionCurrency = transaction.currency;
    transaction.amount = convertToBRL(transaction.amount, transactionCurrency)
    if (transactionCurrency != "BRL") {
      transaction.currency = "All"
    }
    return transaction;
  })
  const currentData = convertedData.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      (transactionDate.getFullYear() === now.getFullYear() &&
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate <= now && transactionDate >= subDays(now, 30))
    );
  });


  const pendingTransactions = convertedData.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate > now
    );
  })

  const pendingDeposits = pendingTransactions
    .filter((transaction) => transaction.transaction_type === 'deposit')
    .reduce((sum, transaction) => sum + transaction.amount, 0) / 100;

  const pendingWithdraws = pendingTransactions
    .filter((transaction) => transaction.transaction_type === 'withdraw')
    .reduce((sum, transaction) => sum + transaction.amount, 0) / 100;

  const totalDeposits = convertedData
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transaction.transaction_type === 'deposit'
        && transactionDate.getFullYear() === now.getFullYear()
        && transactionDate.getMonth() === now.getMonth()
        && transactionDate <= now && transactionDate >= subDays(now, 30);
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0) / 100;

  const totalWithdraws = convertedData
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transaction.transaction_type === 'withdraw'
        && transactionDate.getFullYear() === now.getFullYear()
        && transactionDate.getMonth() === now.getMonth()
        && transactionDate <= now && transactionDate >= subDays(now, 30)
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0) / 100;

  return {
    transactions: currentData,
    pendingTransactionsSum: pendingDeposits - pendingWithdraws,
    totalDeposits: totalDeposits,
    totalWithdraws: totalWithdraws,
  };
});

