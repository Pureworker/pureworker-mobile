import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function French(props:any) {
  return (
    <Svg
      width={54}
      height={41}
      viewBox="0 0 54 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_3908_154)">
        <Path d="M0 0h54v40.5H0V0z" fill="#fff" />
        <Path d="M0 0h17.997v40.5H0V0z" fill="#000091" />
        <Path d="M36.003 0H54v40.5H36.003V0z" fill="#E1000F" />
      </G>
      <Defs>
        <ClipPath id="clip0_3908_154">
          <Path fill="#fff" d="M0 0H54V40.5H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default French
