import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string }}
) {
  const id = params.id;
  const searchParams = req.nextUrl.searchParams;
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // const searchParams = req.nextUrl.searchParams;
  const { displayName, email, photoURL }  = await req.json();

  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const userRef = db.collection('users').doc(id);
  
  try {
    const res = await userRef.set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      displayName,
      email,
      isObject: true,
      lastLoginTime: admin.firestore.FieldValue.serverTimestamp(),
      photoURL,
      profile: {
        introduction: '',
        interests: [],
        mbti: ''
      },
      uid: id
    });

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const searchParams = req.nextUrl.searchParams;
  // const {} = await req.json();
  
  if (searchParams.get('type') === 'signin') {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
  
    const userRef = db.collection('users').doc(id);
  
    try {
      const res = await userRef.update({
        isOnline: true,
        lastLoginTime: admin.firestore.FieldValue.serverTimestamp()
      })
  
      return NextResponse.json(res, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json(error, { status: 500 });
    }
  } else if (searchParams.get('type') === 'profile') {
    // 
  }
};