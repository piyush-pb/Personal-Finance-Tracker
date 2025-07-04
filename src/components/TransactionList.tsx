"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { transactionSchema, CATEGORIES } from "@/utils/validation";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
}

interface TransactionListProps {
  refreshTrigger?: any;
}

export default function TransactionList({ refreshTrigger }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({ amount: "", date: "", description: "", category: "Other" });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editApiError, setEditApiError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError("Could not load transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [refreshTrigger, refresh]);

  // Edit logic
  const openEdit = (tx: Transaction) => {
    setEditTx(tx);
    setEditForm({
      amount: tx.amount.toString(),
      date: tx.date.slice(0, 10),
      description: tx.description,
      category: tx.category || "Other",
    });
    setEditErrors({});
    setEditApiError("");
  };
  const closeEdit = () => {
    setEditTx(null);
    setEditForm({ amount: "", date: "", description: "", category: "Other" });
    setEditErrors({});
    setEditApiError("");
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    setEditErrors({ ...editErrors, [e.target.name]: "" });
    setEditApiError("");
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditApiError("");
    setEditLoading(true);
    const parsed = transactionSchema.safeParse({
      amount: Number(editForm.amount),
      date: editForm.date,
      description: editForm.description,
      category: editForm.category,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setEditErrors(fieldErrors);
      setEditLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: editTx!._id,
          amount: Number(editForm.amount),
          date: editForm.date,
          description: editForm.description,
          category: editForm.category,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditApiError(data.error ? JSON.stringify(data.error) : "Failed to update transaction");
      } else {
        closeEdit();
        setRefresh((r) => r + 1);
      }
    } catch (err) {
      setEditApiError("Network error");
    }
    setEditLoading(false);
  };

  // Delete logic
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/transactions?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        // Optionally handle error
      }
      setDeleteId(null);
      setRefresh((r) => r + 1);
    } catch (err) {
      // Optionally handle error
    }
    setDeleteLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading transactions...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (transactions.length === 0) return <div className="text-center py-8">No transactions found.</div>;

  return (
    <div className="overflow-x-auto w-full max-w-2xl mx-auto mt-8">
      <table className="min-w-full bg-white dark:bg-zinc-900 rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-2 px-4">${tx.amount.toFixed(2)}</td>
              <td className="py-2 px-4">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="py-2 px-4">{tx.category}</td>
              <td className="py-2 px-4">{tx.description}</td>
              <td className="py-2 px-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(tx)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleteId(tx._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Dialog */}
      <Dialog open={!!editTx} onOpenChange={closeEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Amount</label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={handleEditChange}
                disabled={editLoading}
              />
              {editErrors.amount && <div className="text-red-500 text-sm mt-1">{editErrors.amount}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <Input
                name="date"
                type="date"
                value={editForm.date}
                onChange={handleEditChange}
                disabled={editLoading}
              />
              {editErrors.date && <div className="text-red-500 text-sm mt-1">{editErrors.date}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                disabled={editLoading}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {editErrors.category && <div className="text-red-500 text-sm mt-1">{editErrors.category}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                disabled={editLoading}
              />
              {editErrors.description && <div className="text-red-500 text-sm mt-1">{editErrors.description}</div>}
            </div>
            {editApiError && <div className="text-red-600 text-sm mb-2">{editApiError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEdit} disabled={editLoading}>Cancel</Button>
              <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this transaction?</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 