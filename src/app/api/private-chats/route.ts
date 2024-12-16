import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "@/app/api/_utils/functions";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  console.log('GET request received');
  const searchParams = req.nextUrl.searchParams;

  // see if the associated private chat exists
  const mId = searchParams.get('myId');
  const fId = searchParams.get('friendId');
  console.log('mId:', mId, 'fId:', fId);

  // check if their dm chat exists
  const privateChatRef = firestore.collection('private_chats');
  const q = privateChatRef
    .where('from', 'in', [mId, fId])
    .where('to', 'in', [mId, fId]);

  try {
    console.log('Checking for existing private chat');
    const querySnapshot = await q.get();

    // if no private chat exists, return an acknowledgement
    if (querySnapshot.empty) {
      console.log('No existing private chat found, return an acknowledgement');
      return NextResponse.json({ message: "chat does not exist!" }, { status: 200 });
    }
    
    // if private chat exists, return the chat id
    else {
      console.log('Private chat already exists');
      return NextResponse.json({ message: "chat exists!", id: querySnapshot.docs[0].id }, { status: 200 });
    }
  } catch (err) {
    console.error('Error checking or creating private chat:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  console.log('POST request received');
  const searchParams = req.nextUrl.searchParams;

  // create a new private chat
  try {
    const mId = searchParams.get('myId');
    const fId = searchParams.get('friendId');

    const privateChatRef = firestore.collection('private_chats');

    const chatRef = await privateChatRef.add({
      from: mId,
      to: fId,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log('New private chat created with id:', chatRef.id);
    return NextResponse.json({ message: "private chat created!", id: chatRef.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};