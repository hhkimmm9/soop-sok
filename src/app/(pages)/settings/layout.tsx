import React from "react"
import type { JSX } from "react"

type SettingsLayoutProps = {
  children: React.ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps): JSX.Element => {
  return <div className="p-4">{children}</div>
}

SettingsLayout.displayName = "SettingsLayout"

export default SettingsLayout
