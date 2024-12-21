import NavBar from "@/app/_components/NavBar"
import { AppStateProvider } from "@/utils/AppStateProvider"
import theme from "@/utils/ThemeProvider"
import { ThemeProvider } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import dynamic from "next/dynamic"
import React from "react"
import type { JSX } from "react"

const DialogWrapper = dynamic(
  () => import("@/app/_components/dialogs/DialogWrapper"),
  { ssr: false },
)

type wrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({ children }: wrapperProps): JSX.Element => {
  return (
    <AppStateProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className="mx-auto h-screen w-screen bg-stone-50">
          <div className="h-[calc(100vh-3.5rem)]">{children}</div>
          <NavBar />
        </main>
        <DialogWrapper />
      </ThemeProvider>
    </AppStateProvider>
  )
}

export default Wrapper
