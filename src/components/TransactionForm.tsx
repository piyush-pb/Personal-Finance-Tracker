"use client";
import { useState } from "react";

import { transactionSchema, CATEGORIES } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TransactionFormProps {
  onSuccess?: () => void;
}

export default function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [form, setForm] = useState({ amount: "", date: "", description: "", category: "Other" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);
    // Validate with Zod
    const parsed = transactionSchema.safeParse({
      amount: Number(form.amount),
      date: form.date,
      description: form.description,
      category: form.category,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    // POST to API
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(form.amount),
          date: form.date,
          description: form.description,
          category: form.category,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setApiError(data.error ? JSON.stringify(data.error) : "Failed to add transaction");
      } else {
        setForm({ amount: "", date: "", description: "", category: "Other" });
        setErrors({});
        if (onSuccess) onSuccess();
      }
    } catch {
      setApiError("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.amount && <div className="text-red-500 text-sm mt-1">{errors.amount}</div>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          disabled={loading}
          className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
      </div>
      {apiError && <div className="text-red-600 text-sm mb-2">{apiError}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
} 