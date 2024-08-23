import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props : any) {
  return (
    <Svg
      width={80}
      height={80}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M66.667 13.333H56.1L50 6.667H30l-6.1 6.666H13.334A6.667 6.667 0 006.667 20v40a6.667 6.667 0 006.667 6.667h53.333A6.666 6.666 0 0073.334 60V20a6.667 6.667 0 00-6.667-6.667zm0 46.667H13.334V20h13.5l6.1-6.667h14.133l6.1 6.667h13.5v40zM40 23.333a16.667 16.667 0 100 33.334 16.667 16.667 0 000-33.334zM40 50a10 10 0 110-20 10 10 0 010 20z"
        fill="#88087B"
      />
    </Svg>
  )
}

export default SvgComponent
