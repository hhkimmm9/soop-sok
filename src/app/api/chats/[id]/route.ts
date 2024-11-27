import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';
import { TChat } from "@/types";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const { id } = params;
  const { uid } = await req.json();
  const searchParams = req.nextUrl.searchParams
  
  const chatRef = firestore.collection('chats').doc(id);

  try {
    const chatDoc = await chatRef.get();
    const chatData: TChat = chatDoc.data() as TChat;

    if (searchParams.get('action') === 'enter') {
      if (chatData.numMembers >= chatData.capacity) {
        return NextResponse.json({ error: 'Chat is full' }, { status: 400 });
      }
  
      const newMembers = [ ...chatData.members, uid ];
      const newNumMembers = chatData.numMembers + 1;
  
      // Add uid to the members and update the number of members in the chat document.
      await chatRef.update(chatRef, {
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else if (searchParams.get('action') === 'leave') {
      const newMembers = chatData.members.filter(member => member !== uid);
      const newNumMembers = chatData.numMembers - 1;
  
      // Remove uid from the members and update the number of members in the chat document.
      await chatRef.update(chatRef, {
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ message: "chat updated!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};