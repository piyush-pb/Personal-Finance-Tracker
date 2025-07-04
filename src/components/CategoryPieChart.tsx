"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORIES } from "@/utils/validation";

const COLORS = [
  "#6366f1", // Food
  "#f59e42", // Transport
  "#10b981", // Utilities
  "#f43f5e", // Entertainment
  "#a21caf", // Health
  "#eab308", // Shopping
  "#0ea5e9", // Education
  "#64748b", // Other
];

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface CategoryPieChartProps {
  refreshTrigger?: any;
}

export default function CategoryPieChart({ refreshTrigger }: CategoryPieChartProps) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
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
        // Group by category
        const byCategory: Record<string, number> = {};
        transactions.forEach((tx) => {
          byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
        });
        const chartData = CATEGORIES.map((cat) => ({ name: cat, value: byCategory[cat] || 0 }));
        setData(chartData.filter((d) => d.value > 0));
      } catch (err) {
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
      <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 