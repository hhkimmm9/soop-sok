import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { Filter } from "firebase-admin/firestore";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  // TODO: check the token and use it for authentication
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
  }

  const { senderId, friendId } = await req.json();

  try {
    db.collection('friend_list').add({
      senderId,
      friendId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return NextResponse.json({ message: 'friend added!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};