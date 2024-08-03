import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props:any) => (
  <ContentLoader 
    speed={2}
    width={340}
    height={84}
    viewBox="0 0 340 84"
    backgroundColor="#f2f2f2"
    foregroundColor="#ffffff"
    {...props}
  >
    <rect x="67" y="3" rx="3" ry="3" width="67" height="11" /> 
    <rect x="143" y="3" rx="3" ry="3" width="140" height="11" /> 
    <rect x="194" y="51" rx="3" ry="3" width="53" height="11" /> 
    <rect x="240" y="25" rx="3" ry="3" width="72" height="11" /> 
    <rect x="85" y="51" rx="3" ry="3" width="100" height="11" /> 
    <rect x="67" y="74" rx="3" ry="3" width="37" height="11" /> 
    <rect x="85" y="26" rx="3" ry="3" width="140" height="11" /> 
    <circle cx="38" cy="41" r="27" />
  </ContentLoader>
)

export default MyLoader