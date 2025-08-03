import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Transaction } from '@/lib/models/Transaction';
import { transactionSchema } from '@/utils/validation';

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    await connectToDatabase();
    const transaction = await Transaction.create({
      amount: parsed.data.amount,
      date: new Date(parsed.data.date),
      description: parsed.data.description,
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body._id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await Transaction.findByIdAndUpdate(
      body._id,
      {
        amount: parsed.data.amount,
        date: new Date(parsed.data.date),
        description: parsed.data.description,
      },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
    }
    await connectToDatabase();
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
} 