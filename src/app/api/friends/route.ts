import { type NextRequest, NextResponse } from "next/server"

import { getToken } from "@/app/api/_utils/functions"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"

export async function POST(req: NextRequest) {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 401 })
  }

  const { senderId, friendId } = await req.json()

  try {
    firestore.collection("friend_list").add({
      createdAt: FieldValue.serverTimestamp(),
      friendId,
      senderId,
    })

    return NextResponse.json({ message: "friend added!" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
