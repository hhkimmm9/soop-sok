import NavBar from "@/components/NavBar";
import DialogWrapper from "@/components/dialogs/DialogWrapper";

// import dynamic from "next/dynamic";

interface IWrapperProps {
  children: React.ReactNode;
}

// const DialogWrapper = dynamic(() => import("@/components/dialogs/DialogWrapper"), { ssr: false });

const Wrapper = ({ children }: IWrapperProps) => {
  return (
  <>
    {/* TODO: doesn"t fit on iphones. */}
    <main className="
      relative
      w-screen min-w-80 max-w-[430px]
      h-screen min-h-[667px]
      mx-auto
    ">
      <div className="min-h-[calc(667px-3.5rem)] h-[calc(100vh-3.5rem)]">
        { children }
      </div>
      
      <NavBar />
    </main>

    <DialogWrapper />
  </>
  )
};

export default Wrapper;