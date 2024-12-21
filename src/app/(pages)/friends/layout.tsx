import React from "react"
import type { JSX } from "react"

type FriendsLayoutProps = {
  children: React.ReactNode
}

const FriendsLayout = ({ children }: FriendsLayoutProps): JSX.Element => {
  return <div className="p-4">{children}</div>
}

FriendsLayout.displayName = "FriendsLayout"

export default FriendsLayout
