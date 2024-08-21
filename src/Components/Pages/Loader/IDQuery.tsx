import ContentLoader from "react-content-loader"

const MyLoader = (props: any) => (
  <ContentLoader
    speed={2}
    width={200}
    height={20}
    viewBox="0 0 200 20"
    backgroundColor="#d5d5d5"
    foregroundColor="#f3f3f3"
    {...props}
  >
    <rect x="16" y="0" rx="2" ry="2" width="168" height="20" />

  </ContentLoader>
)

export default MyLoader

