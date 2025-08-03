import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Budget } from '@/lib/models/Budget';
import { budgetSchema } from '@/utils/validation';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter);
    return NextResponse.json(budgets, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = budgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    await connectToDatabase();
    const budget = await Budget.create(parsed.data);
    return NextResponse.json(budget, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add budget' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body._id) {
      return NextResponse.json({ error: 'Missing budget ID' }, { status: 400 });
    }
    const parsed = budgetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    await connectToDatabase();
    const updated = await Budget.findByIdAndUpdate(
      body._id,
      parsed.data,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing budget ID' }, { status: 400 });
    }
    await connectToDatabase();
    const deleted = await Budget.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 