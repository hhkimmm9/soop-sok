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

  const { uid, cid, senderName, senderPhotoURL, message }  = await req.json();

  try {
    await db.collection('messages').add({
      uid,
      cid,
      senderName,
      senderPhotoURL,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    return NextResponse.json({ ack: "message sent!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};