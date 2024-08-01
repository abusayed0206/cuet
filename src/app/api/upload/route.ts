// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const file = formData.get('file') as File;

    if (!id || !file) {
      console.error('Missing ID or file');
      return NextResponse.json({ error: 'ID and file are required' }, { status: 400 });
    }

    // Validate file size and type
    if (file.size > 200 * 1024) {
      console.error('File size exceeds limit', file.size);
      return NextResponse.json({ error: 'File size exceeds 200KB' }, { status: 400 });
    }

    if (file.type !== 'image/webp') {
      console.error('Invalid file type', file.type);
      return NextResponse.json({ error: 'File must be in WebP format' }, { status: 400 });
    }

    console.log('Forwarding request to Cloudflare Worker');
    const workerResponse = await fetch('https://dplink.lrsayed.workers.dev/', {
      method: 'POST',
      body: formData,
    });

    console.log('Worker response status:', workerResponse.status);
    if (workerResponse.ok) {
      return NextResponse.json({ message: 'File uploaded successfully' });
    } else {
      const result = await workerResponse.json();
      console.error('Worker error:', result);
      return NextResponse.json({ error: result.error || 'Failed to upload file' }, { status: workerResponse.status });
    }
  } catch (error: unknown) {
    console.error('Unexpected error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
