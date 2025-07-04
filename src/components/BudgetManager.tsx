"use client";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Budget {
  _id?: string;
  category: string;
  month: string;
  amount: number;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetManager() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [budgets, setBudgets] = useState<Record<string, Budget>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  const fetchBudgets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/budgets?month=${month}`);
      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data: Budget[] = await res.json();
      const byCat: Record<string, Budget> = {};
      const inputVals: Record<string, string> = {};
      data.forEach((b) => {
        byCat[b.category] = b;
        inputVals[b.category] = b.amount.toString();
      });
      setBudgets(byCat);
      setInputs(inputVals);
    } catch (err) {
      setError("Could not load budgets");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBudgets();
    // eslint-disable-next-line
  }, [month]);

  const handleInput = (cat: string, val: string) => {
    setInputs((prev) => ({ ...prev, [cat]: val }));
  };

  const handleSave = async (cat: string) => {
    setSaving((prev) => ({ ...prev, [cat]: true }));
    setError("");
    const amount = Number(inputs[cat]);
    if (isNaN(amount) || amount < 0) {
      setError("Amount must be a positive number");
      setSaving((prev) => ({ ...prev, [cat]: false }));
      return;
    }
    try {
      const method = budgets[cat]?._id ? "PUT" : "POST";
      const body = {
        _id: budgets[cat]?._id,
        category: cat,
        month,
        amount,
      };
      const res = await fetch("/api/budgets", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ? JSON.stringify(data.error) : "Failed to save budget");
      } else {
        fetchBudgets();
      }
    } catch (err) {
      setError("Network error");
    }
    setSaving((prev) => ({ ...prev, [cat]: false }));
  };

  const handleDelete = async (cat: string) => {
    if (!budgets[cat]?._id) return;
    setDeleting((prev) => ({ ...prev, [cat]: true }));
    setError("");
    try {
      const res = await fetch(`/api/budgets?id=${budgets[cat]._id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete budget");
      } else {
        fetchBudgets();
      }
    } catch (err) {
      setError("Network error");
    }
    setDeleting((prev) => ({ ...prev, [cat]: false }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-zinc-900 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Monthly Budgets</h2>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Month:</label>
        <Input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-40"
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {loading ? (
        <div className="text-center py-8">Loading budgets...</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Budget</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="py-2 px-4">{cat}</td>
                <td className="py-2 px-4">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={inputs[cat] ?? ""}
                    onChange={(e) => handleInput(cat, e.target.value)}
                    className="w-32"
                  />
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(cat)}
                    disabled={saving[cat]}
                  >
                    {budgets[cat]?._id ? "Update" : "Add"}
                  </Button>
                  {budgets[cat]?._id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(cat)}
                      disabled={deleting[cat]}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 