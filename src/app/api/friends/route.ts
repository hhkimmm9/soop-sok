import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';
import { Filter } from "firebase-admin/firestore";
import { TUser } from "@/types";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  // TODO: check the token and use it for authentication
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const senderId = searchParams.get('senderId');
  const friendId = searchParams.get('friendId');

  const friendRef = firestore.collection('friend_list');
  
  if (friendId == null) {
    try {
      const res = await friendRef.where(
        Filter.or(
          Filter.where('senderId', '==', senderId),
          Filter.where('friendId', '==', senderId)
      )).get();
      
      if (res.empty) {
        return NextResponse.json({ error: 'No frineds found.' }, { status: 404 });
      }
  
      const friends: TUser[] = res.docs.map((doc: any) => ({
        id: doc.id, ...doc.data()
      } as TUser));
  
      return NextResponse.json(friends, { status: 200 });
      
    } catch (error) {
      console.error(error);
      return NextResponse.json(error, { status: 500 });
    }
  }
  else {
    try {
      const res = await friendRef.where(
        Filter.or(
          Filter.and(Filter.where('senderId', '==', senderId), Filter.where('friendId', '==', friendId)),
          Filter.and(Filter.where('senderId', '==', friendId), Filter.where('friendId', '==', senderId)),
      )).get();
      
      if (res.empty) {
        return NextResponse.json({ isMyFriend: false }, { status: 200 });
      }
  
      return NextResponse.json({ isMyFriend: true }, { status: 200 });
      
    } catch (error) {
      console.error(error);
      return NextResponse.json(error, { status: 500 });
    }
  }
};

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided.' }, { status: 401 });
  }

  const { senderId, friendId } = await req.json();

  try {
    firestore.collection('friend_list').add({
      createdAt: FieldValue.serverTimestamp(),
      friendId,
      senderId,
    });

    return NextResponse.json({ message: 'friend added!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};