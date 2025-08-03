"use client";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/utils/validation";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface DashboardSummaryProps {
  refreshTrigger?: number;
}

export default function DashboardSummary({ refreshTrigger }: DashboardSummaryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data: Transaction[] = await res.json();
        setTransactions(data);
      } catch {
        setError("Could not load dashboard data");
      }
      setLoading(false);
    };
    fetchData();
  }, [refreshTrigger]);

  if (loading) return <div className="text-center py-8">Loading summary...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (transactions.length === 0) return <div className="text-center py-8">No transactions yet.</div>;

  // Total expenses
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  // Top 3 categories
  const byCategory: Record<string, number> = {};
  transactions.forEach((tx) => {
    byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
  });
  const topCategories = CATEGORIES
    .map((cat) => ({ name: cat, value: byCategory[cat] || 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  // 3 most recent transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow flex flex-col items-center">
        <div className="text-zinc-500 text-sm mb-1">Total Expenses</div>
        <div className="text-2xl font-bold">${total.toFixed(2)}</div>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow">
        <div className="text-zinc-500 text-sm mb-2">Top Categories</div>
        <ul className="space-y-1">
          {topCategories.length === 0 ? (
            <li className="text-zinc-400">No data</li>
          ) : (
            topCategories.map((cat) => (
              <li key={cat.name} className="flex justify-between">
                <span>{cat.name}</span>
                <span>${cat.value.toFixed(2)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded shadow">
        <div className="text-zinc-500 text-sm mb-2">Recent Transactions</div>
        <ul className="space-y-1">
          {recent.length === 0 ? (
            <li className="text-zinc-400">No data</li>
          ) : (
            recent.map((tx) => (
              <li key={tx._id} className="flex flex-col text-xs border-b last:border-b-0 border-zinc-200 dark:border-zinc-800 pb-1 mb-1 last:pb-0 last:mb-0">
                <span className="font-semibold">${tx.amount.toFixed(2)} - {tx.category}</span>
                <span>{new Date(tx.date).toLocaleDateString()} - {tx.description}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 