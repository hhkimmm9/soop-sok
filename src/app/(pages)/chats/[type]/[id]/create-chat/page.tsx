"use client"

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { ChangeEvent, ReactNode, useEffect, useState } from "react"

import { TBanner } from "@/types"
import useDialogs from "@/utils/dispatcher"
import { auth } from "@/utils/firebase/firebase"
import { createChat, getBanner } from "@/utils/firebase/firestore"

type pageProps = {
  params: {
    type: string
    id: string
  }
}

const Page = ({ params }: pageProps) => {
  const [formState, setFormState] = useState({
    capacity: 2,
    isPrivate: false,
    name: "",
    password: "",
    tagOptions: [] as string[],
    tag: "",
  })

  const router = useRouter()

  const { messageDialog } = useDialogs()

  useEffect(() => {
    const fetchBannerOptions = async () => {
      if (auth) {
        try {
          const banner: TBanner | null = await getBanner()
          if (banner) {
            setFormState((prevState) => ({
              ...prevState,
              tagOptions: banner.tagOptions,
            }))
          }
        } catch (err) {
          console.error(err)
          messageDialog.show("data_retrieval")
        }
      }
    }
    fetchBannerOptions()
  }, [messageDialog])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    setFormState((prevState) => ({
      ...prevState,
      capacity: newValue as number,
    }))
  }

  const handleSelectChange = (
    e: SelectChangeEvent<string>,
    child: ReactNode,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      tag: e.target.value as string,
    }))
  }

  const handlePrivacyChange = (isPrivate: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      isPrivate,
    }))
  }

  const redirectToFeaturesPage = () => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`)
    else router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const currentUser = auth.currentUser

    // TODO: validate the inputs
    if (currentUser && formState.name.length > 0) {
      try {
        const cid = await createChat(
          params.id,
          currentUser.uid,
          formState.capacity,
          formState.name,
          formState.tag,
          formState.isPrivate,
          formState.password,
        )

        if (cid) router.push(`/chats/chatroom/${cid}`)
      } catch (err) {
        console.error(err)
        messageDialog.show("general")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
      {/* input fields */}
      <div className="flex grow flex-col gap-6 overflow-y-auto rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-center text-2xl font-semibold capitalize text-earth-600">
          create a new chat
        </h1>

        {/* name */}
        <div className="flex flex-col gap-2">
          {/* TODO: no rounded? */}
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
          />
        </div>

        {/* tag */}
        <div className="flex flex-col gap-2">
          {/* TODO: no rounded? */}
          <FormControl fullWidth>
            <InputLabel id="tag-select-label">Tag</InputLabel>
            <Select
              labelId="tag-select-label"
              id="tag-select"
              label="Tag"
              value={formState.tag}
              onChange={handleSelectChange}
            >
              {formState.tagOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* capacity */}
        <div className="flex flex-col gap-3">
          <label htmlFor="capacity">Capacity</label>
          <div className="grid grid-cols-6">
            <div className="col-span-3 pl-3">
              <Stack
                spacing={2}
                direction="row"
                sx={{ mb: 1 }}
                alignItems="center"
              >
                {/* TODO: color: earth */}
                <Slider
                  aria-label="capacity"
                  min={2}
                  max={5}
                  step={1}
                  marks={true}
                  color="primary"
                  value={formState.capacity}
                  onChange={handleSliderChange}
                />
              </Stack>
            </div>
            <span className="col-span-1 col-start-6 mr-4 text-right">
              {formState.capacity}
            </span>
          </div>
        </div>

        {/* isPrivate */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2">
            <div className="flex gap-2">
              <input
                type="radio"
                id="public"
                name="privacy"
                value="public"
                checked={!formState.isPrivate}
                onChange={() => handlePrivacyChange(false)}
                className="hidden"
              />
              <label
                htmlFor="public"
                className="inline-flex cursor-pointer items-center"
              >
                <span
                  className={`mr-2 h-4 w-4 flex-shrink-0 rounded-full border ${!formState.isPrivate ? "border-earth-500 bg-earth-500" : "border-gray-400 bg-white"}`}
                ></span>
                Public
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="private"
                name="privacy"
                value="private"
                checked={formState.isPrivate}
                onChange={() => handlePrivacyChange(true)}
                className="hidden"
              />
              <label
                htmlFor="private"
                className="inline-flex cursor-pointer items-center"
              >
                <span
                  className={`mr-2 h-4 w-4 flex-shrink-0 rounded-full border ${formState.isPrivate ? "border-earth-500 bg-earth-500" : "border-gray-400 bg-white"}`}
                ></span>
                Private
              </label>
            </div>
          </div>
        </div>

        {/* password */}
        <div
          className={`flex flex-col gap-2 ${
            formState.isPrivate
              ? "pointer-events-auto opacity-100 duration-300 ease-in"
              : "pointer-events-none opacity-0 duration-300 ease-in"
          } `}
        >
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* buttons */}
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
