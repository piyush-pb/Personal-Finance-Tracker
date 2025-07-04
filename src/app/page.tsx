"use client";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpensesBarChart from "@/components/ExpensesBarChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetManager from "@/components/BudgetManager";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import SpendingInsights from "@/components/SpendingInsights";
import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Finance Visualizer</h1>
      <DashboardSummary refreshTrigger={refresh} />
      <BudgetManager />
      <BudgetVsActualChart />
      <SpendingInsights />
      <TransactionForm onSuccess={() => setRefresh((r) => r + 1)} />
      <ExpensesBarChart refreshTrigger={refresh} />
      <CategoryPieChart refreshTrigger={refresh} />
      <TransactionList refreshTrigger={refresh} />
    </div>
  );
}
