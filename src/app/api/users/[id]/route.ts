import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  // TODO: check the token and use it for authentication
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string }}
) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const id = params.id;

  const userRef = firestore.collection('users').doc(id);
  
  try {
    const res = await userRef.get();
    
    if (!res.exists) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    return NextResponse.json(res.data(), { status: 200 });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }

  
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const id = params.id;
  // const searchParams = req.nextUrl.searchParams;
  const { displayName, email, photoURL }  = await req.json();

  const userRef = firestore.collection('users').doc(id);
  
  try {
    await userRef.set({
      createdAt: FieldValue.serverTimestamp(),
      displayName,
      email,
      isObject: true,
      lastLoginTime: FieldValue.serverTimestamp(),
      photoURL,
      profile: {
        introduction: '',
        interests: [],
        mbti: ''
      },
      uid: id
    });

    return NextResponse.json({ message: 'User registered!' }, { status: 200 });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const id = params.id;
  const searchParams = req.nextUrl.searchParams;
  
  const userRef = firestore.collection('users').doc(id);
  
  try {
    // user sign in
    if (searchParams.get('type') === 'signin') {
      await userRef.update({
        isOnline: true,
        lastLoginTime: FieldValue.serverTimestamp()
      })
    }
    
    // user sign out
    else if (searchParams.get('type') === 'signout') {
      await userRef.update({
        isOnline: false,
      }) 
    }
    
    // user profile update
    else if (searchParams.get('type') === null) {
      const { user } = await req.json();
      await userRef.update(user);
    }

    return NextResponse.json({ message: 'User status updated!' }, { status: 200 });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};