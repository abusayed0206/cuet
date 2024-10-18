import { NextResponse } from 'next/server';

const validateStudentId = (id: string) => {
  const regex = /^[0-9]{7}$/;
  return regex.test(id);
};

// Function to generate the OG image as SVG
const generateOgSvg = (studentData: { name: string; studentid: string; department: string; dplink: string; batch: string }) => {
  const escapedName = studentData.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedDepartment = studentData.department.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>
      <circle cx="600" cy="200" r="100" fill="white"/>
      <image href="${studentData.dplink || 'https://cdn.abusayed.dev/demo.png'}" x="500" y="100" height="200" width="200" clip-path="circle(100px at center)"/>
      <text x="600" y="380" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">${escapedName}</text>
      <text x="600" y="440" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)" text-anchor="middle">ID: ${studentData.studentid} | Batch: ${studentData.batch}</text>
      <text x="600" y="490" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)" text-anchor="middle">${escapedDepartment}</text>
      <line x1="240" y1="520" x2="960" y2="520" stroke="rgba(255,255,255,0.5)" stroke-width="3"/>
    </svg>
  `;
};

// API Route to handle Open Graph image generation
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  // Validate the student ID
  if (!studentId || !validateStudentId(studentId)) {
    return new NextResponse('Invalid student ID', { status: 400 });
  }

  try {
    // Fetch student data from the existing API
    const response = await fetch(`https://cuet.sayed.page/api/student/${studentId}`, { next: { revalidate: 3600 } });

    if (!response.ok) {
      return new NextResponse('Failed to fetch student data', { status: 404 });
    }

    const studentData = await response.json();
    const svgContent = generateOgSvg(studentData);

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new NextResponse('Error generating OG image', { status: 500 });
  }
}

export const runtime = 'edge';