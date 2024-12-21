import React from "react"
import type { JSX } from "react"

type ProfileLayoutProps = {
  children: React.ReactNode
}

const ProfileLayout = ({ children }: ProfileLayoutProps): JSX.Element => {
  return <div className="p-4">{children}</div>
}

ProfileLayout.displayName = "ProfileLayout"

export default ProfileLayout
