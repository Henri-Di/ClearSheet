import { GlobalTransactionsDashboard } from "../panels/GlobalTransactionsDashboard";
import { TransactionsSkeleton } from "../components/TransactionsSkeleton";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionsPage() {
  const { loading } = useTransactions();

  return (
    <div className="text-inherit">
      {loading ? <TransactionsSkeleton /> : <GlobalTransactionsDashboard />}
    </div>
  );
}
