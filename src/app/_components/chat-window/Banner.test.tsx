import "@testing-library/jest-dom"

import { render } from "@testing-library/react"
import React from "react"

import Banner from "./Banner"

test("renders Banner component", () => {
  const { getByText } = render(<Banner />)
  const linkElement = getByText(/banner content/i)
  expect(linkElement).toBeInTheDocument()
})
