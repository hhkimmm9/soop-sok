import { getToken } from "@/app/api/_utils/functions"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Handles GET requests to check for the existence of a private chat between two users.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object.
 *
 * This function performs the following steps:
 * 1. Retrieves the authentication token from the request.
 * 2. If no token is provided, returns a 401 Unauthorized response.
 * 3. Extracts the `myId` and `friendId` from the request's query parameters.
 * 4. Checks if a private chat exists between the two users in the Firestore database.
 * 5. If no private chat exists, returns a response indicating that the chat does not exist.
 * 6. If a private chat exists, returns a response with the chat ID.
 * 7. Handles any errors that occur during the process and returns a 500 Internal Server Error response.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  console.log("GET request received")
  const searchParams = req.nextUrl.searchParams

  // extract the user ids from the query parameters
  const mId = searchParams.get("myId")
  const fId = searchParams.get("friendId")
  console.log("mId:", mId, "fId:", fId)

  // query for the private chat between the two users
  const privateChatRef = firestore.collection("private_chats")
  const q = privateChatRef
    .where("from", "in", [mId, fId])
    .where("to", "in", [mId, fId])

  try {
    // check if a private chat already exists
    console.log("Checking for existing private chat")
    const querySnapshot = await q.get()

    // if no private chat exists, return a message indicating that the chat does not exist
    if (querySnapshot.empty) {
      console.log("No existing private chat found")
      return NextResponse.json(
        { message: "chat does not exist!" },
        { status: 200 },
      )
    }
    // if a private chat already exists, return the chat ID
    else {
      console.log("Private chat already exists")
      return NextResponse.json(
        { message: "chat exists!", id: querySnapshot.docs[0].id },
        { status: 200 },
      )
    }
  } catch (err) {
    // handle any errors that occur during the process
    console.error("Error checking or creating private chat:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  // extract the user ids from the query parameters
  console.log("POST request received")
  const searchParams = req.nextUrl.searchParams

  try {
    // extract the user ids from the query parameters
    const mId = searchParams.get("myId")
    const fId = searchParams.get("friendId")

    // reference to the private chats collection
    const privateChatRef = firestore.collection("private_chats")

    // create a new private chat between the two users
    const chatRef = await privateChatRef.add({
      from: mId,
      to: fId,
      createdAt: FieldValue.serverTimestamp(),
    })

    // log the chat ID and return a success message
    console.log("New private chat created with id:", chatRef.id)
    return NextResponse.json(
      { message: "private chat created!", id: chatRef.id },
      { status: 200 },
    )
  } catch (error) {
    // handle any errors that occur during the process
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
