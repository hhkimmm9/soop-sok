import { type NextRequest, NextResponse } from "next/server";
import { firestore } from "@/db/firebaseAdmin";

// Utility function to extract token
function getToken(req: NextRequest): string | null {
  const authHeader = req.headers?.get("Authorization");
  return authHeader ? authHeader.split("Bearer ")[1] : null;
};

export async function GET(req: NextRequest) {
  console.log("Received GET request");
  const token = getToken(req);
  if (!token) {
    console.log("No token provided");
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const cid = req.nextUrl.searchParams.get("cid");
  console.log("Conversation ID:", cid);

  if (!cid) {
    console.log("No conversation ID provided");
    return NextResponse.json({ error: "No conversation ID provided" }, { status: 400 });
  }

  try {
    const messageRef = firestore.collection("messages");
    const res = await messageRef
      .where("cid", "==", cid)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    const latestMessage = res.empty ? [] : res.docs.map((doc: { data: () => any; }) => doc.data());

    console.log("Latest message:", latestMessage);
    return NextResponse.json({ latestMessage }, { status: 200 });
  } catch (error) {
    console.error("Error fetching latest message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};