import { NextResponse } from 'next/server';
import axios from 'axios';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes': string[];
  challenge_ts: string;
  hostname: string;
};

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }

  try {
    const response = await axios.post<TurnstileVerifyResponse>(
      TURNSTILE_VERIFY_URL,
      {
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    if (response.data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, errors: response.data['error-codes'] }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}