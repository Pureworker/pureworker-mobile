import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function CompleteTick(props:any) {
  return (
    <Svg
      width={10}
      height={11}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_3679_3730)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.977 2.63a.625.625 0 010 .883L4.293 8.198a.667.667 0 01-.943 0L1.022 5.87a.625.625 0 11.884-.884l1.915 1.915 4.272-4.273a.625.625 0 01.884 0z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3679_3730">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0H10V10H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default CompleteTick
