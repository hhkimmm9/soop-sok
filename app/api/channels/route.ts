import { type NextRequest, NextResponse } from "next/server";
import { admin, db } from '@/db/firebaseAdmin';
import { TChannel } from "@/types";

export async function GET(req: NextRequest) {
  const token = req.headers?.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const channelsRef = db.collection('channels');
  try {
    const channelsData: TChannel[] = []
    const res = await channelsRef.get();
    if (!res.empty) {
      // console.log(res);
      res.forEach((doc: any) => {
        channelsData.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
    }
    return NextResponse.json(channelsData, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
};