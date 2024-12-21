import { fetchWithAuth } from "./fetchWithAuth"

export async function makeFriend(
  friendId: string,
  senderId: string,
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth("/api/friends", {
      method: "POST",
      body: JSON.stringify({ friendId, senderId }),
    })
    console.log(ack.message)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

// TODO: can we make it more efficient?
export async function checkIsMyFriend(
  uid: string,
  friendId: string,
): Promise<boolean | null> {
  try {
    const isMyFriend = await fetchWithAuth(
      `/api/friends/${friendId}?senderId=${uid}`,
      { method: "GET" },
    )
    console.log("checkIsMyFriend", isMyFriend.isMyFriend)
    return isMyFriend.isMyFriend
  } catch (err) {
    console.error(err)
    return null
  }
}
