import * as React from "react"
import Svg, { Path } from "react-native-svg"

function InfoIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8 1.5A6.5 6.5 0 1014.5 8 6.507 6.507 0 008 1.5zm-.25 3a.75.75 0 110 1.5.75.75 0 010-1.5zm.75 7a1 1 0 01-1-1V8a.5.5 0 010-1 1 1 0 011 1v2.5a.5.5 0 010 1z"
        fill="#fff"
      />
    </Svg>
  )
}

export default InfoIcon
