import * as React from "react"
import Svg, { Path } from "react-native-svg"

function UpDown(props:any) {
  return (
    <Svg
      width={7}
      height={14}
      viewBox="0 0 7 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.001.282l2.6 4.834H.401l2.6-4.834zM3.001 13.196L.438 8.342l5.198.039L3 13.196z"
        fill="#fff"
        fillOpacity={0.6}
      />
    </Svg>
  )
}

export default UpDown
