import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props:any) => (
  <ContentLoader 
    speed={2}
    width={1549}
    height={90}
    viewBox="0 0 1549 90"
    backgroundColor="#d5d5d5"
    foregroundColor="#f3f3f3"
    {...props}
  >
    <rect x="15" y="15" rx="5" ry="5" width="60" height="60" /> 
    <rect x="125" y="15" rx="5" ry="5" width="300" height="20" /> 
    <rect x="125" y="50" rx="5" ry="5" width="150" height="10" /> 

    <rect x="550" y="15" rx="5" ry="5" width="300" height="20" /> 
    <rect x="550" y="50" rx="5" ry="5" width="150" height="10" /> 

    <rect x="950" y="15" rx="5" ry="5" width="300" height="20" />
    <rect x="950" y="50" rx="5" ry="5" width="150" height="10" /> 

    <rect x="1400" y="20" rx="3" ry="3" width="120" height="40" />
  </ContentLoader>
)

export default MyLoader