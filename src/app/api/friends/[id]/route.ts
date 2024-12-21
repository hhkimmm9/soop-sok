import { getToken } from "@/app/api/_utils/functions"
import { firestore } from "@/utils/firebase/firebaseAdmin"
import { Filter } from "firebase-admin/firestore"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  params: Promise<{ id: string }>,
): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 401 })
  }

  const friendId = (await params).id
  const searchParams = req.nextUrl.searchParams
  const senderId = searchParams.get("senderId")

  const friendRef = firestore.collection("friend_list")

  try {
    const res = await friendRef
      .where(
        Filter.or(
          Filter.and(
            Filter.where("senderId", "==", senderId),
            Filter.where("friendId", "==", friendId),
          ),
          Filter.and(
            Filter.where("senderId", "==", friendId),
            Filter.where("friendId", "==", senderId),
          ),
        ),
      )
      .get()

    if (res.empty)
      return NextResponse.json({ isMyFriend: false }, { status: 200 })

    return NextResponse.json({ isMyFriend: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
