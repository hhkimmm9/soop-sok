import { type NextRequest, NextResponse } from "next/server";
import { firestore, FieldValue } from '@/utils/firebase/firebaseAdmin';
import { TBanner } from "@/types";

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

  const bannerRef = firestore.collection('banners');
  const bannerQuery = bannerRef.where('selected', '==', true);
  try {
    const res = await bannerQuery.get();
    
    if (res.empty) {
      return NextResponse.json({ error: 'No selected banner found' }, { status: 404 });
    }

    const banner = res.docs[0].data() as TBanner
    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

export  async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const { cid, content, tagOptions }  = await req.json();

  try {
    await firestore.collection('banners').add({
      cid,
      content,
      createdAt: FieldValue.serverTimestamp(),
      selected: false,
      tagOptions,
    });
    return NextResponse.json({ message: 'banner added!' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
};