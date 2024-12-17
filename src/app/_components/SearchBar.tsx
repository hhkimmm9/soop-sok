import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

type SearchBarProps = {
  onSubmit: (searchQuery: string) => void
}

const SearchBar = ({ onSubmit }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleChange = async (searchQuery: string) => {
    setSearchQuery(searchQuery)
    onSubmit(searchQuery)
  }

  return (
    <div className="flex items-center gap-3">
      {/* search input field */}
      <div className="grow rounded-lg bg-white p-0.5">
        <div className="flex h-10 items-center justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleChange(e.target.value)}
            className="grow px-2 py-1 outline-none"
          />
          <button type="submit" className="mr-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
