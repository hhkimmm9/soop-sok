import { apiReqWithAuth } from "./apiReqWithAuth"

export async function createChat(
  cid: string,
  uid: string,
  capacity: number,
  name: string,
  tag: string,
  isPrivate: boolean,
  password: string,
): Promise<string | null> {
  try {
    const data = await apiReqWithAuth("/api/chats", {
      method: "POST",
      body: JSON.stringify({
        cid,
        uid,
        capacity,
        name,
        tag,
        isPrivate,
        password,
      }),
    })
    console.log(data.message)
    return data.cid
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function updateChat(
  cid: string,
  uid: string,
  action: string,
): Promise<boolean> {
  try {
    const ack = await apiReqWithAuth(`/api/chats/${cid}?action=${action}`, {
      method: "PUT",
      body: JSON.stringify({ uid }),
    })
    console.log(ack.message)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
