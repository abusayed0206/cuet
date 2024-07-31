// app/api/upload/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get('id') as string;
  const file = formData.get('file') as File;

  if (!id || !file) {
    return NextResponse.json({ error: 'ID and file are required' }, { status: 400 });
  }

  // Validate file size and type
  if (file.size > 200 * 1024) {
    return NextResponse.json({ error: 'File size exceeds 200KB' }, { status: 400 });
  }

  if (file.type !== 'image/webp') {
    return NextResponse.json({ error: 'File must be in WebP format' }, { status: 400 });
  }

  // Forward the request to the Cloudflare Worker
  try {
    const workerResponse = await fetch('https://dplink.lrsayed.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    if (workerResponse.ok) {
      return NextResponse.json({ message: 'File uploaded successfully' });
    } else {
      const result = await workerResponse.json();
      return NextResponse.json({ error: result.error || 'Failed to upload file' }, { status: workerResponse.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
