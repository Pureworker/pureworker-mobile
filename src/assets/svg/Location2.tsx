import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function LocationIcon2(props) {
  return (
    <Svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_3664_2535)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2.5a9 9 0 019 9c0 3.074-1.676 5.59-3.442 7.395-.883.892-1.845 1.7-2.876 2.416l-.426.29-.2.133-.377.24-.336.205-.416.242a1.874 1.874 0 01-1.854 0l-.416-.242-.52-.32-.192-.125-.41-.273a20.641 20.641 0 01-3.093-2.566C4.676 17.089 3 14.574 3 11.5a9 9 0 019-9zm0 2a7 7 0 00-7 7c0 2.322 1.272 4.36 2.871 5.996.688.696 1.43 1.335 2.222 1.91l.458.326c.148.103.29.199.427.288l.39.25.343.209.289.169.455-.269.367-.23c.195-.124.405-.263.627-.417l.458-.326a18.022 18.022 0 002.222-1.91C17.728 15.861 19 13.822 19 11.5a7 7 0 00-7-7zm0 3a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3664_2535">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default LocationIcon2
