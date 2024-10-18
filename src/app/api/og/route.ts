import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';

const validateStudentId = (id: string) => {
  const regex = /^[0-9]{7}$/;
  return regex.test(id);
};

// Function to generate the OG image
const generateOgImage = async (studentData: { name: string; studentid: string; department: string; dplink: string; batch: string }) => {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#4f46e5'); // Indigo
  gradient.addColorStop(1, '#7c3aed'); // Purple
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add a decorative pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < width; i += 50) {
    for (let j = 0; j < height; j += 50) {
      ctx.beginPath();
      ctx.arc(i, j, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Load the student's display picture or fallback image
  const imageUrl = studentData.dplink || 'https://cdn.abusayed.dev/demo.png';
  let profileImage;

  try {
    profileImage = await loadImage(imageUrl);
  } catch (error) {
    profileImage = await loadImage('https://cdn.abusayed.dev/demo.png');
  }

  // Set dimensions for the display picture
  const maxImageSize = 180;
  const imageAspectRatio = profileImage.width / profileImage.height;
  let imageWidth, imageHeight;

  if (imageAspectRatio > 1) {
    imageWidth = maxImageSize;
    imageHeight = maxImageSize / imageAspectRatio;
  } else {
    imageHeight = maxImageSize;
    imageWidth = maxImageSize * imageAspectRatio;
  }

  const imageX = (width - imageWidth) / 2;
  const imageY = height * 0.25 - imageHeight / 2;

  // Create a rounded clipping region with a white border
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, imageY + imageHeight / 2, Math.max(imageWidth, imageHeight) / 2 + 5, 0, Math.PI * 2, true);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width / 2, imageY + imageHeight / 2, Math.max(imageWidth, imageHeight) / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // Draw the profile image
  ctx.drawImage(profileImage, imageX, imageY, imageWidth, imageHeight);
  ctx.restore();

  // Add the student's name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(studentData.name, width / 2, imageY + maxImageSize + 80);

  // Add student ID and batch
  ctx.font = '36px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(`ID: ${studentData.studentid} | Batch: ${studentData.batch}`, width / 2, imageY + maxImageSize + 140);

  // Add department
  ctx.fillText(studentData.department, width / 2, imageY + maxImageSize + 190);

  // Add a decorative underline
  ctx.beginPath();
  ctx.moveTo(width * 0.2, imageY + maxImageSize + 220);
  ctx.lineTo(width * 0.8, imageY + maxImageSize + 220);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();

  return canvas.toBuffer('image/png');
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
    const imageBuffer = await generateOgImage(studentData); // Note the await here

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching student data', { status: 500 });
  }
}
https://cuet.pages.dev/1901048