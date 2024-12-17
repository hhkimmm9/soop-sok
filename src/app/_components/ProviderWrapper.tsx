import { ThemeProvider } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import dynamic from "next/dynamic"

import NavBar from "@/app/_components/NavBar"
import { AppStateProvider } from "@/utils/AppStateProvider"
import theme from "@/utils/ThemeProvider"
const DialogWrapper = dynamic(
  () => import("@/app/_components/dialogs/DialogWrapper"),
  { ssr: false },
)

interface IWrapperProps {
  children: React.ReactNode
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
    <AppStateProvider>
      {/* mui-material */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* TODO: doesn"t fit on iphones. */}
        <main className="mx-auto h-screen w-screen bg-stone-50">
          <div className="h-[calc(100vh-3.5rem)">{children}</div>

          <NavBar />
        </main>

        <DialogWrapper />
      </ThemeProvider>
    </AppStateProvider>
  )
}

export default Wrapper
