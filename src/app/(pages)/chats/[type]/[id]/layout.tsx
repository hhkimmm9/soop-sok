import React from "react"
import type { JSX } from "react"

type FeaturesLayoutProps = {
  children: React.ReactNode
}

const FeaturesLayout = ({ children }: FeaturesLayoutProps): JSX.Element => {
  return <div className="h-full py-8">{children}</div>
}

FeaturesLayout.displayName = "FeaturesLayout"

export default FeaturesLayout
