// src/pages/api/check-student-id.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseServer } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { studentid } = req.body;

  if (!studentid) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  const { data, error } = await supabaseServer
    .from('apidata')
    .select('email')
    .eq('studentid', studentid)
    .single();

  if (error || !data) {
    return res.status(404).json({ message: 'Student ID not found' });
  }

  // If student ID exists, return the associated email
  return res.status(200).json({ email: data.email });
}
