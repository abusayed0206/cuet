import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get the current user's session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get the form data from the request body
    const formData = await req.json();

    // Validation: Check if public_email is present and valid
    if (!formData.public_email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.public_email)) {
      return NextResponse.json({ error: 'Invalid or missing public email' }, { status: 400 });
    }

    // Update the user's profile in the 'apidata' table
    const { data, error } = await supabase
      .from('apidata')
      .update({
        currentstatus: formData.currentStatus,
        phonenumber: formData.phoneNumber,
        bloodgroup: formData.bloodGroup,
        hall: formData.hall,
        linkedin: formData.linkedin,
        uniqueid: formData.uniqueId,
        public_email: formData.public_email, // Ensure this field is updated
      })
      .eq('email', user.email);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update profile', details: err.message }, { status: 500 });
  }
}
