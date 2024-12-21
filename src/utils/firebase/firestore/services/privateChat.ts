import { fetchWithAuth } from "./fetchWithAuth"

export async function getOrCreateChatId(
  myId: string,
  friendId: string,
): Promise<any> {
  if (!myId || !friendId) return null

  try {
    // create the url for the request
    const url = `/api/private-chats?myId=${myId}&friendId=${friendId}`

    // check if chat exists
    let data = await fetchWithAuth(url, { method: "GET" })
    console.log(data.message)

    // if no chat exists, create a new chat
    if (data.id == undefined) {
      data = await fetchWithAuth(url, { method: "POST" })
      console.log(data.message)
    }

    // return the chat id
    return data
  } catch (err) {
    // handle any errors that occur during the process
    console.error(err)
    return
  }
}
