import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PointerRight(props) {
  return (
    <Svg
      width={10}
      height={12}
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.545 6.01L0 0l1.269 6.01L0 12l9.545-5.99z"
        fill="#88087B"
      />
    </Svg>
  )
}

export default PointerRight
