"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

export default function BudgetVsActualChart() {
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
      } catch (err) {
        setError("Could not load chart data");
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
  // Prepare chart data
  const chartData = CATEGORIES.map((cat) => {
    const budget = budgets.find((b) => b.category === cat)?.amount || 0;
    const actual = txByCat[cat] || 0;
    return { category: cat, Budget: budget, Actual: actual };
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-zinc-900 p-4 rounded shadow">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Budget vs Actual</h2>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-40 ml-auto"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading chart...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Budget" fill="#eab308" />
            <Bar dataKey="Actual" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 