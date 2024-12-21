import "@testing-library/jest-dom"
import Banner from "./Banner"
import { render } from "@testing-library/react"

// eslint-disable-next-line no-undef
test("renders Banner component", () => {
  const { getByText } = render(<Banner />)
  const linkElement = getByText(/banner content/i)
  // eslint-disable-next-line no-undef
  expect(linkElement).toBeInTheDocument()
})
