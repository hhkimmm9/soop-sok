import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { TChannel } from "@/types";

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
  const searchParams = req.nextUrl.searchParams;
  const action = searchParams.get('action');

  const channelRef = db.collection('channels').doc(id);
  
  try {
    const channelDoc = await channelRef.get();
    const channelData: TChannel = channelDoc.data() as TChannel;

    if (action === 'enter') {
      if (channelData.numMembers >= channelData.capacity) {
        return NextResponse.json({ error: 'Channel is full' }, { status: 400 });
      }
    
      const newMembers = [ ...channelData.members, uid ];
      const newNumMembers = channelData.numMembers + 1;
    
      await channelRef.update(channelRef, {
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else if (action === 'leave') {
      const newMembers = channelData.members.filter(member => member !== uid);
      const newNumMembers = channelData.numMembers - 1;
    
      await channelRef.update(channelRef, {
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return NextResponse.json({ message: 'chat updated!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
};