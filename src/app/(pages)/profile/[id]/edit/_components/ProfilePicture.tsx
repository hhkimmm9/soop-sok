import Image from "next/image"
import { ChangeEvent, useCallback } from "react"

interface ProfilePictureProps {
  photoURL: string | undefined
  updateField: (field: string, value: any, isProfileField: boolean) => void
}

const ProfilePicture = ({ photoURL, updateField }: ProfilePictureProps) => {
  const handlePhotoURLChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateField("photoURL", e, false)
    },
    [updateField],
  )

  return (
    <div className="flex justify-center">
      <label htmlFor="profilePic" className="cursor-pointer">
        <Image
          src={photoURL || "/images/default-avatar.png"}
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
