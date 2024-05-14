import Banner from "@/components/chat-window/Banner";
import MessageContainer from "@/components/chat-window/MessageContainer";

type PageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: PageProps) => {
  return (
    <div className="h-full grid grid-rows-12 bg-stone-100">
      { params.type === "public-chat" && (
        <Banner />
      )}

      {/*  */}
      <div className={`${params.type === "public-chat" ?
        'row-start-2 row-span-11' : 'row-start-1 row-span-12'
      }`}>
        <div className="h-full flex flex-col gap-4">
          <MessageContainer type={params.type} cid={params.id} />
        </div>
      </div>
    </div>
  )
};

export default Page;