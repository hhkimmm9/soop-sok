import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';
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
  console.log('Received PUT request');
  const token = getToken(req);
  if (!token) {
    console.log('No token provided');
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const { id } = params;
  console.log(`Channel ID: ${id}`);
  const { uid } = await req.json();
  console.log(`User ID: ${uid}`);
  const searchParams = req.nextUrl.searchParams;
  const action = searchParams.get('action');
  console.log(`Action: ${action}`);

  const channelRef = firestore.collection('channels').doc(id);
  
  try {
    const channelDoc = await channelRef.get();
    const channelData: TChannel = channelDoc.data() as TChannel;
    console.log('Channel data:', channelData);

    if (action === 'enter') {
      if (channelData.numMembers >= channelData.capacity) {
        console.log('Channel is full');
        return NextResponse.json({ error: 'Channel is full' }, { status: 400 });
      }
    
      const newMembers = [ ...channelData.members, uid ];
      const newNumMembers = channelData.numMembers + 1;
      console.log('New members:', newMembers);
      console.log('New number of members:', newNumMembers);
    
      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else if (action === 'leave') {
      const newMembers = channelData.members.filter(member => member !== uid);
      const newNumMembers = channelData.numMembers - 1;
      console.log('New members:', newMembers);
      console.log('New number of members:', newNumMembers);
    
      await channelRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    console.log('Chat updated successfully');
    return NextResponse.json({ message: 'chat updated!' }, { status: 200 });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(error, { status: 500 });
  }
};