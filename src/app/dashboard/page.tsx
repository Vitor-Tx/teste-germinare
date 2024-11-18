import Dashboard from "@/components/dashboard/dashboard";
import { getTransactionData } from "@/lib/get-transaction-data";

export default async function Page() {
  const { transactions, pendingTransactionsSum, totalDeposits, totalWithdraws } = await getTransactionData();
  return (
    <Dashboard initialTransactions={transactions}
      initialPendingSum={pendingTransactionsSum}
      initialDeposits={totalDeposits}
      initialWithdraws={totalWithdraws}
    ></Dashboard>
  );
}