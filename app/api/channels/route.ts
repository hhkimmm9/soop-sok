import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { TChannel } from "@/types";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get('Authorization');
  return authHeader ? authHeader.split('Bearer ')[1] : null;
};

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const channelsRef = db.collection('channels');
  try {
    const res = await channelsRef.get();
    if (res.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const channels: TChannel[] = res.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as TChannel));

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};