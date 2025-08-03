"use client";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpensesBarChart from "@/components/ExpensesBarChart";
import CategoryPieChart from "@/components/CategoryPieChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetManager from "@/components/BudgetManager";
import BudgetVsActualChart from "@/components/BudgetVsActualChart";
import SpendingInsights from "@/components/SpendingInsights";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useState, useEffect } from "react";
import { PostHog } from "@/components/PostHogProvider";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  // Track page load
  useEffect(() => {
    PostHog.capture('dashboard_viewed', {
      page: 'finance_dashboard',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleTransactionSuccess = () => {
    PostHog.capture('transaction_added', {
      action: 'add_transaction',
      timestamp: new Date().toISOString(),
    });
    setRefresh((r) => r + 1);
  };

  const handleBudgetUpdate = () => {
    PostHog.capture('budget_updated', {
      action: 'update_budget',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center">Personal Finance Visualizer</h1>
      <DashboardSummary refreshTrigger={refresh} />
      <BudgetManager onUpdate={handleBudgetUpdate} />
      <BudgetVsActualChart />
      <SpendingInsights />
      <TransactionForm onSuccess={handleTransactionSuccess} />
      <ExpensesBarChart refreshTrigger={refresh} />
      <CategoryPieChart refreshTrigger={refresh} />
      <TransactionList refreshTrigger={refresh} />
      <AnalyticsDashboard />
    </div>
  );
}
