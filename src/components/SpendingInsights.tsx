"use client";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/utils/validation";
import { Input } from "@/components/ui/input";

interface Budget {
  _id?: string;
  category: string;
  month: string;
  amount: number;
}

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getStatus(actual: number, budget: number) {
  if (budget === 0) return "No budget";
  if (actual > budget) return "Over budget";
  if (actual >= 0.9 * budget) return "Near budget";
  return "Under budget";
}

export default function SpendingInsights() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [budgetsRes, txRes] = await Promise.all([
          fetch(`/api/budgets?month=${month}`),
          fetch(`/api/transactions`),
        ]);
        if (!budgetsRes.ok || !txRes.ok) throw new Error("Failed to fetch data");
        const budgetsData: Budget[] = await budgetsRes.json();
        const txData: Transaction[] = await txRes.json();
        setBudgets(budgetsData);
        setTransactions(txData);
      } catch {
        setError("Could not load insights");
      }
      setLoading(false);
    };
    fetchData();
  }, [month]);

  // Calculate actual spending per category for the selected month
  const txByCat: Record<string, number> = {};
  transactions.forEach((tx) => {
    const txMonth = tx.date.slice(0, 7);
    if (txMonth === month) {
      txByCat[tx.category] = (txByCat[tx.category] || 0) + tx.amount;
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-zinc-900 p-4 rounded shadow">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Spending Insights</h2>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-40 ml-auto"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading insights...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Budget</th>
              <th className="py-2 px-4 text-left">Actual</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => {
              const budget = budgets.find((b) => b.category === cat)?.amount || 0;
              const actual = txByCat[cat] || 0;
              const status = getStatus(actual, budget);
              return (
                <tr key={cat} className={`border-t border-zinc-200 dark:border-zinc-800 ${status === "Over budget" ? "bg-red-100 dark:bg-red-900" : status === "Near budget" ? "bg-yellow-50 dark:bg-yellow-900" : ""}`}>
                  <td className="py-2 px-4">{cat}</td>
                  <td className="py-2 px-4">${budget.toFixed(2)}</td>
                  <td className="py-2 px-4">${actual.toFixed(2)}</td>
                  <td className="py-2 px-4 font-semibold">
                    {status === "Over budget" ? <span className="text-red-600">{status}</span> : status === "Near budget" ? <span className="text-yellow-700">{status}</span> : status === "Under budget" ? <span className="text-green-700">{status}</span> : <span className="text-zinc-500">{status}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
} 