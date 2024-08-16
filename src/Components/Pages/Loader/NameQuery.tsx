import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props: any) => (
  <ContentLoader
    speed={2}
    width={200}
    height={32}
    viewBox="0 0 200 32"
    backgroundColor="#d5d5d5"
    foregroundColor="#f3f3f3"
    {...props}
  >
    <rect x="16" y="5" rx="2" ry="2" width="80" height="20" />
    <rect x="108" y="5" rx="2" ry="2" width="80" height="20" />

  </ContentLoader>
)

export default MyLoader

