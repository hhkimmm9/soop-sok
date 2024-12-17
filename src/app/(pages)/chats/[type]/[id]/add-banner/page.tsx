"use client"

import { BackspaceIcon } from "@heroicons/react/24/outline"
import { Button, TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"

import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { addBanner } from "@/utils/firebase/firestore"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const Page = ({ params }: pageProps) => {
  const [bannerContent, setBannerContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tagOptions, setTagOptions] = useState<string[]>([])

  const router = useRouter()

  const { messageDialog } = useDialogs()

  const addToList = () => {
    if (tagOptions.length < 5) {
      setTagOptions((prev) => {
        if (!prev.includes(tagInput)) {
          return [...prev, tagInput]
        } else return [...prev]
      })
    } else {
      // TODO: dialog - too many tag options.
    }
  }

  const deleteFromList = (tagOption: string) => {
    if (auth && tagOptions.length > 0) {
      setTagOptions((prev) => prev.filter((option) => option !== tagOption))
    }
  }

  const redirectToFeaturesPage = () => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`)
    else router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentUser = auth.currentUser
    if (!currentUser) return

    if (bannerContent.length > 0) {
      try {
        const res = await addBanner(params.id, bannerContent, tagOptions)

        //

        if (res) {
          router.push(`/chats/channel/${params.id}`)
        }
      } catch (err) {
        console.error(err)
        messageDialog.show("general")
      }
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex h-full flex-col gap-4"
    >
      <div className="flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-4">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          add a new banner
        </h1>

        {/* name */}
        <TextField
          id="outlined-basic"
          label="Banner"
          variant="outlined"
          value={bannerContent}
          onChange={(e) => setBannerContent(e.target.value)}
        />

        {/* tag options */}
        <div className="flex flex-col gap-4">
          <div className="mt-2 flex gap-2">
            <TextField
              id="outlined-basic"
              label="Tag Input"
              variant="outlined"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="grow"
            />
            <Button
              variant="outlined"
              onClick={() => {
                addToList()
                setTagInput("")
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {/* container for tag options */}
        <div>
          {tagOptions.length > 0 && (
            <>
              <div className="min-h-14 rounded-sm border border-gray-300 p-3">
                <div className="flex flex-col gap-3">
                  {tagOptions.map((tagOption, index) => (
                    <div
                      key={tagOption}
                      className="flex items-center justify-between"
                    >
                      <p className="whitespace-nowrap">{`${index + 1}. ${tagOption}`}</p>
                      <BackspaceIcon
                        className="h-5 cursor-pointer text-gray-500"
                        onClick={() => deleteFromList(tagOption)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-2 px-1 text-sm text-gray-400">
                Other users would only be able to choose one of the available
                options
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={redirectToFeaturesPage}
          className="w-full rounded-lg bg-white py-4 text-xl font-semibold text-earth-400 shadow transition duration-300 ease-in-out hover:bg-earth-50"
        >
          {" "}
          Cancel{" "}
        </button>

        <button
          type="submit"
          className="w-full rounded-lg bg-earth-100 py-4 text-xl font-semibold text-earth-600 shadow transition duration-300 ease-in-out hover:bg-earth-200"
        >
          {" "}
          Create{" "}
        </button>
      </div>
    </form>
  )
}

export default Page
