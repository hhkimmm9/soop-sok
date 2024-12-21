import { apiReqWithAuth } from "./apiReqWithAuth"

export async function sendMessage(
  uid: string,
  cid: string,
  senderName: string | null,
  senderPhotoURL: string | null,
  message: string,
): Promise<any> {
  try {
    const response = await apiReqWithAuth("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, cid, senderName, senderPhotoURL, message }),
    })

    if (!response.ok) throw new Error(`Error: ${response.statusText}`)

    const sendMessageAck = await response.json()
    console.log(sendMessageAck)
    return sendMessageAck
  } catch (err) {
    console.error("Failed to send message:", err)
    return null
  }
}
