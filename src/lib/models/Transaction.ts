import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category: string;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: 'Other' },
});

export const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema); 