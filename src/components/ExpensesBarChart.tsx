"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
}

interface MonthlyData {
  month: string;
  total: number;
}

interface ExpensesBarChartProps {
  refreshTrigger?: number;
}

export default function ExpensesBarChart({ refreshTrigger }: ExpensesBarChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const transactions: Transaction[] = await res.json();
        // Group by month
        const monthly: Record<string, number> = {};
        transactions.forEach((tx) => {
          const d = new Date(tx.date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          monthly[key] = (monthly[key] || 0) + tx.amount;
        });
        const chartData = Object.entries(monthly)
          .map(([month, total]) => ({ month, total }))
          .sort((a, b) => a.month.localeCompare(b.month));
        setData(chartData);
      } catch {
        setError("Could not load chart data");
      }
      setLoading(false);
    };
    fetchData();
  }, [refreshTrigger]);

  if (loading) return <div className="text-center py-8">Loading chart...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (data.length === 0) return <div className="text-center py-8">No data to display.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-zinc-900 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 