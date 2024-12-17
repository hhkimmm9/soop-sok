import { apiReqWithAuth } from "./apiReqWithAuth"

export async function updateChannel(
  cid: string,
  uid: string,
  action: string,
): Promise<boolean> {
  try {
    const ack = await apiReqWithAuth(`/api/channels/${cid}?action=${action}`, {
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
