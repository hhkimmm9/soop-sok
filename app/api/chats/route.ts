import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/db/firebaseAdmin';

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const { uid, capacity, cid, isPrivate, name, password, tag } = await req.json();

    const chatDoc = await firestore.collection('chats').add({
      capacity,
      cid,
      createdAt: FieldValue.serverTimestamp(),
      isPrivate,
      members: [uid],
      name,
      numMembers: 1,
      password,
      tag,
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ message: "chat created!", cid: chatDoc.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
