import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function USA2(props:any) {
  return (
    <Svg
      width={14}
      height={11}
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_3910_858)">
        <Path d="M0 0h14v10.75H0" fill="#BD3D44" />
        <Path
          d="M0 1.239h14H0zm0 1.65h14H0zm0 1.657h14H0zm0 1.658h14H0zM0 7.86h14H0zm0 1.657h14H0z"
          fill="#000"
        />
        <Path
          d="M0 1.239h14M0 2.889h14M0 4.546h14M0 6.204h14M0 7.86h14M0 9.518h14"
          stroke="#fff"
        />
        <Path d="M0 0h7.98v5.79H0" fill="#192F5D" />
      </G>
      <Defs>
        <ClipPath id="clip0_3910_858">
          <Path fill="#fff" d="M0 0H14V10.75H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default USA2
