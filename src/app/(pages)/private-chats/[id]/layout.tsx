import React from "react"
import type { JSX } from "react"

type PrivateChatLayoutProps = {
  children: React.ReactNode
}

const PrivateChatLayout = ({
  children,
}: PrivateChatLayoutProps): JSX.Element => {
  return <div className="p-4">{children}</div>
}

PrivateChatLayout.displayName = "PrivateChatLayout"

export default PrivateChatLayout
