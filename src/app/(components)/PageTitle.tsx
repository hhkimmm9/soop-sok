import type { JSX } from "react"

type PageTitleProps = {
  title: string
}
const PageTitle = ({ title }: PageTitleProps): JSX.Element => {
  return (
    <h1 className="my-8 text-center text-3xl font-semibold text-earth-600">
      {title}
    </h1>
  )
}

export default PageTitle
