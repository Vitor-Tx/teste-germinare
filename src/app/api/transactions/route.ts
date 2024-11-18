import { subDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { Transaction } from '@/lib/types';
import { convertToBRL } from '@/lib/utils';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataPath = process.env.NEXT_PUBLIC_API_DATA_URL;
    const { searchParams } = new URL(request.url ?? "");
    console.log("Manually parsed params:", searchParams);
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    const now = new Date();
    const to = new Date(searchParams.get("to") as string || Date.now());
    const from = new Date(searchParams.get("from") as string || subDays(to, 30));
    const currency = searchParams.get("currency") || 'All';
    const industry = searchParams.get("industry") || 'All';
    const resolvedPath = path.resolve(dataPath + '/ordered_data.json')
    const jsonData = await fs.readFile(resolvedPath, 'utf-8');
    const data: Transaction[] = JSON.parse(jsonData);

    let filteredData = data;
    console.log("full URL: ");
    console.log(request.url);
    console.log("params: ");
    console.log(from);
    console.log(to);
    console.log(currency);
    console.log(industry);
    filteredData = data.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate >= from &&
        transactionDate <= to &&
        (currency === "All" || transaction.currency === currency) &&
        (industry === "All" || transaction.industry === industry)
      );
    });
    let convertedData = filteredData;
    if (currency === "All") {
      convertedData = filteredData.map((transaction) => {
        const transactionCurrency = transaction.currency;
        transaction.amount = convertToBRL(transaction.amount, transactionCurrency)
        if (transactionCurrency != "BRL") {
          transaction.currency = "All"
        }
        return transaction;
      })
    }

    console.log(convertedData.length);

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
    return NextResponse.json({
      return: true,
      message: "Successfully got transactions.",
      data: convertedData,
      length: convertedData.length,
      filters: {
        to: searchParams.get("to"),
        from: searchParams.get("from"),
        currency: searchParams.get("currency"),
        industry: searchParams.get("industry"),
      },
      pendingTransactionsSum: pendingDeposits - pendingWithdraws,
      totalDeposits: totalDeposits,
      totalWithdraws: totalWithdraws,
    }, { status: 200 })

  }
  catch (e) {
    return NextResponse.json({ return: false, message: e, data: [] }, { status: 500 })
  }

};
