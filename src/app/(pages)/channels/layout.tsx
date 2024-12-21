import React from "react"
import type { JSX } from "react"

type PublicChatLayoutProps = {
  children: React.ReactNode
}

const PublicChatLayout = ({ children }: PublicChatLayoutProps): JSX.Element => {
  return <div className="h-full p-4">{children}</div>
}

PublicChatLayout.displayName = "PublicChatLayout"

export default PublicChatLayout
