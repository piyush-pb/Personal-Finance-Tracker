import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI value:', JSON.stringify(process.env.MONGODB_URI));
    console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length);
    console.log('MONGODB_URI first 20 chars:', process.env.MONGODB_URI?.substring(0, 20));
    
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ 
        error: 'MONGODB_URI not found',
        envVars: Object.keys(process.env).filter(key => key.includes('MONGODB'))
      }, { status: 500 });
    }

    await connectToDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      uriLength: process.env.MONGODB_URI.length
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'MongoDB connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      uriValue: JSON.stringify(process.env.MONGODB_URI),
      uriLength: process.env.MONGODB_URI?.length
    }, { status: 500 });
  }
} 