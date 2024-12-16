import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/api/_utils/functions";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';

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
};