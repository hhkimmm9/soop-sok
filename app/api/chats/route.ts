import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { Transaction } from "firebase-admin/firestore";
import { TChat } from "@/types";

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

  const {
    uid,
    capacity,
    cid,
    isPrivate,
    name,
    password,
    tag,
  }  = await req.json();

  try {  
    const chatDoc = await db.collection('chats').add({
      capacity,
      cid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isPrivate,
      members: [ uid ],
      name,
      numMembers: 1,
      password,
      tag,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ message: "chat created!", cid: chatDoc.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};