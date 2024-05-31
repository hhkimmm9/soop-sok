import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { Transaction } from "firebase-admin/firestore";
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
  
  try {
    // await db.runTransaction(db, async (transaction: Transaction) => {
    //   const chatDoc = await transaction.get(chatRef);

    //   if (!chatDoc.docs[0].exists) {
    //     return NextResponse.json({ error: 'No chat found' }, { status: 404 });
    //   }

    //   const chatData: TChat = chatDoc.docs[0].data() as TChat;

    //   if (chatData.numMembers >= chatData.capacity) {
    //     return NextResponse.json({ error: 'Chat is full' }, { status: 400 });
    //   }

    //   const newMembers = [ ...chatData.members, uid ];
    //   const newNumMembers = chatData.numMembers + 1;

    //   // Add uid to the members and update the number of members in the chat document.
    //   await transaction.update(chatRef, {
    //     members: newMembers,
    //     numMembers: newNumMembers,
    //     updatedAt: admin.firestore.FieldValue.serverTimestamp()
    //   });
    // });

    const chatRef = db.collection('chats').doc(id);
    const chatDoc = await chatRef.get();
    const chatData: TChat = chatDoc.data() as TChat;

    if (chatData.numMembers >= chatData.capacity) {
      return NextResponse.json({ error: 'Chat is full' }, { status: 400 });
    }

    const newMembers = [ ...chatData.members, uid ];
    const newNumMembers = chatData.numMembers + 1;

    // Add uid to the members and update the number of members in the chat document.
    await chatRef.update(chatRef, {
      members: newMembers,
      numMembers: newNumMembers,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ message: "chat updated!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};