import { getToken } from "@/app/api/_utils/functions"
import { TChat } from "@/types"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  console.log("Received PUT request")
  const token = getToken(req)
  if (!token) {
    console.log("No token provided")
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const chatId = (await params).id
  console.log(`Chat ID: ${chatId}`)
  const { uid } = await req.json()
  console.log(`User ID: ${uid}`)
  const searchParams = req.nextUrl.searchParams

  const chatRef = firestore.collection("chats").doc(chatId)

  try {
    const chatDoc = await chatRef.get()
    const chatData: TChat = chatDoc.data() as TChat
    console.log("Chat data:", chatData)

    if (searchParams.get("action") === "enter") {
      console.log("Action: enter")
      if (chatData.numMembers >= chatData.capacity) {
        console.log("Chat is full")
        return NextResponse.json({ error: "Chat is full" }, { status: 400 })
      }

      const newMembers = [...chatData.members, uid]
      const newNumMembers = chatData.numMembers + 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

      // Add uid to the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else if (searchParams.get("action") === "leave") {
      console.log("Action: leave")
      const newMembers = chatData.members.filter((member) => member !== uid)
      const newNumMembers = chatData.numMembers - 1
      console.log("New members:", newMembers)
      console.log("New number of members:", newNumMembers)

      // Remove uid from the members and update the number of members in the chat document.
      await chatRef.update({
        members: newMembers,
        numMembers: newNumMembers,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    console.log("Chat updated successfully")
    return NextResponse.json({ message: "chat updated!" }, { status: 200 })
  } catch (error) {
    console.error("Error updating chat:", error)
    return NextResponse.json(error, { status: 500 })
  }
}
