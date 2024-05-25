import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const { capacity, cid, isPrivate, name, password, tag  }  = await req.json();

  try {
    const res = await db.collection('chats').add({
      capacity,
      cid,
      isPrivate,
      name,
      password,
      tag,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    return NextResponse.json({ message: "chat created!", cid: res.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};