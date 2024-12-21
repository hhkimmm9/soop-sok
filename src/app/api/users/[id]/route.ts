import { getToken } from "@/app/api/(utils)/functions"
import { FieldValue, firestore } from "@/utils/firebase/firebaseAdmin"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "No user ID provided" }, { status: 400 })
  }
  const userRef = firestore.collection("users").doc(id)

  try {
    const res = await userRef.get()

    if (!res.exists) {
      return NextResponse.json({ error: "No user found" }, { status: 404 })
    }

    return NextResponse.json(res.data(), { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const id = (await params).id
  // const searchParams = req.nextUrl.searchParams;
  const { displayName, email, photoURL } = await req.json()

  const userRef = firestore.collection("users").doc(id)

  try {
    await userRef.set({
      createdAt: FieldValue.serverTimestamp(),
      displayName,
      email,
      lastLoginTime: FieldValue.serverTimestamp(),
      photoURL,
      profile: {
        introduction: "",
        interests: [],
        mbti: "",
      },
      uid: id,
    })

    return NextResponse.json({ message: "User registered!" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const id = (await params).id
  const searchParams = req.nextUrl.searchParams

  const userRef = firestore.collection("users").doc(id)

  try {
    // user sign in
    if (searchParams.get("type") === "signin") {
      await userRef.update({
        isOnline: true,
        lastLoginTime: FieldValue.serverTimestamp(),
      })
    }

    // user sign out
    else if (searchParams.get("type") === "signout") {
      await userRef.update({
        isOnline: false,
      })
    }

    // user profile update
    else if (searchParams.get("type") === null) {
      const { user } = await req.json()
      await userRef.update(user)
    }

    return NextResponse.json(
      { message: "User status updated!" },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(error, { status: 500 })
  }
}
