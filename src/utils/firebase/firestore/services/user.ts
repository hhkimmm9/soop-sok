import { apiReqWithAuth } from "./apiReqWithAuth"
import { TUser } from "@/types"

export async function registerUserWithUID(
  displayName: string,
  email: string,
  photoURL: string,
  uid: string,
): Promise<boolean> {
  try {
    const ack = await apiReqWithAuth(`/api/users/${uid}`, {
      method: "POST",
      body: JSON.stringify({ displayName, email, photoURL }),
    })
    console.log(ack.message)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateUserStatus(
  uid: string,
  status: string,
): Promise<boolean> {
  try {
    const ack = await apiReqWithAuth(`/api/users/${uid}?type=${status}`, {
      method: "PUT",
    })
    console.log(ack.message)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function updateUserProfile(
  uid: string,
  user: TUser,
): Promise<boolean> {
  try {
    const ack = await apiReqWithAuth(`/api/users/${uid}`, {
      method: "PUT",
      body: JSON.stringify({ user }),
    })
    console.log("updateUserProfile >> ", ack.message)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function fetchUser(uid: string): Promise<TUser | null> {
  try {
    const user = await apiReqWithAuth(`/api/users/${uid}`, { method: "GET" })
    console.log("fetchUser", user)
    return user
  } catch (err) {
    console.error(err)
    return null
  }
}
