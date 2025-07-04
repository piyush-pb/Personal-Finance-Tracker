import { z } from 'zod';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Education',
  'Other',
] as const;

export const transactionSchema = z.object({
  amount: z.number().positive({ message: 'Amount must be positive' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  description: z.string().min(1, { message: 'Description is required' }),
  category: z.enum(CATEGORIES, { required_error: 'Category is required' }).default('Other'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export const budgetSchema = z.object({
  category: z.enum(CATEGORIES, { required_error: 'Category is required' }),
  month: z.string().regex(/^\d{4}-\d{2}$/, { message: 'Month must be in YYYY-MM format' }),
  amount: z.number().positive({ message: 'Amount must be positive' }),
});

export type BudgetInput = z.infer<typeof budgetSchema>; 