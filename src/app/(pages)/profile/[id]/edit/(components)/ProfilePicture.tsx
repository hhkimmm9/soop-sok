import Image from "next/image"
import { ChangeEvent, useCallback } from "react"
import type { JSX } from "react"

interface ProfilePictureProps {
  photoURL: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}

const ProfilePicture = (props: ProfilePictureProps): JSX.Element => {
  const handlePhotoURLChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      props.updateField("photoURL", e, false)
    },
    [props],
  )

  return (
    <div className="flex justify-center">
      <label htmlFor="profilePic" className="cursor-pointer">
        <Image
          src={props.photoURL || "/images/default-avatar.png"}
          alt="Profile Picture"
          width={192}
          height={192}
          className="rounded-full object-cover"
        />
      </label>
      <input
        type="file"
        id="profilePic"
        onChange={handlePhotoURLChange}
        className="hidden"
      />
    </div>
  )
}

export default ProfilePicture
