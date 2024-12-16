import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';
import { TChat } from "@/types";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('Received PUT request');
  const token = getToken(req);
  if (!token) {
    console.log('No token provided');
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const { id } = params;
  console.log(`Chat ID: ${id}`);
  const { uid } = await req.json();
  console.log(`User ID: ${uid}`);
  const searchParams = req.nextUrl.searchParams;
  
  const chatRef = firestore.collection('chats').doc(id);

  try {
    const chatDoc = await chatRef.get();
    const chatData: TChat = chatDoc.data() as TChat;
    console.log('Chat data:', chatData);

    if (searchParams.get('action') === 'enter') {
      console.log('Action: enter');
      if (chatData.numMembers >= chatData.capacity) {
        console.log('Chat is full');
        return NextResponse.json({ error: 'Chat is full' }, { status: 400 });
      }
  
      const newMembers = [ ...chatData.members, uid ];
      const newNumMembers = chatData.numMembers + 1;
      console.log('New members:', newMembers);
      console.log('New number of members:', newNumMembers);
  
      // Add uid to the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else if (searchParams.get('action') === 'leave') {
      console.log('Action: leave');
      const newMembers = chatData.members.filter(member => member !== uid);
      const newNumMembers = chatData.numMembers - 1;
      console.log('New members:', newMembers);
      console.log('New number of members:', newNumMembers);
  
      // Remove uid from the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    console.log('Chat updated successfully');
    return NextResponse.json({ message: "chat updated!" }, { status: 200 });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(error, { status: 500 });
  }
};