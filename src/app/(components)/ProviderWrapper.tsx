
import { AppStateProvider } from "@/utils/AppStateProvider";
import { ThemeProvider } from "@mui/material";
import theme from "@/utils/ThemeProvider";
import CssBaseline from "@mui/material/CssBaseline";

import NavBar from "@/app/(components)/NavBar";

import dynamic from "next/dynamic";
const DialogWrapper = dynamic(() => import("@/app/(components)/dialogs/DialogWrapper"), { ssr: false });

interface IWrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapperProps) => {
  return (
  <AppStateProvider>
    {/* mui-material */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* TODO: doesn"t fit on iphones. */}
      <main className="
        relative
        w-screen min-w-80 max-w-[430px]
        h-screen min-h-[667px]
        mx-auto
      ">
        <div className="h-[calc(100vh-3.5rem)] bg-stone-50">
          { children }
        </div>
        
        <NavBar />
      </main>

      <DialogWrapper />
    </ThemeProvider>
  </AppStateProvider>
  )
};

export default Wrapper;