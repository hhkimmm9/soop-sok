import ProgressIndicator from "@/app/_components/ProgressIndicator"

const FriendsPageLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <ProgressIndicator />
    </div>
  )
}

FriendsPageLoading.displayName = "FriendsPageLoading"

export default FriendsPageLoading
