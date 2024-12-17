import Cookies from "universal-cookie"

const cookies = new Cookies()
const token = cookies.get("auth-token")

export async function apiReqWithAuth(url: string, options: RequestInit) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || "Request failed")
    }
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}
