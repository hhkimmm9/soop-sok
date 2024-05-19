import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin'; 
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string }}
) {
  const id = params.id;
  const searchParams = req.nextUrl.searchParams;
  const body = await req.json();

  const authResult = body.authResult;

  
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // const searchParams = req.nextUrl.searchParams;
  const { displayName, email, photoURL }  = await req.json();

  const token = req.headers?.get('Authorization')?.split('Bearer ')[1];
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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // const searchParams = req.nextUrl.searchParams;
  // const body = await req.json();
  
  const token = req.headers?.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const userRef = db.collection('users').doc(id);

  try {
    const res = await userRef.update({
      isOnline: true,
      lastLoginTime: admin.firestore.FieldValue.serverTimestamp()
    })

    return NextResponse.json(res , { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};