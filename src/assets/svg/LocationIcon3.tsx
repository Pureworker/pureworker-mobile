import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function LocationIcon3(props) {
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#clip0_3765_2433)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 1.962a6.75 6.75 0 016.75 6.75c0 2.305-1.257 4.192-2.582 5.546a15.332 15.332 0 01-2.156 1.812l-.32.217-.15.1-.283.18-.252.154-.312.181a1.405 1.405 0 01-1.39 0l-.312-.181-.39-.24-.144-.094-.308-.205a15.48 15.48 0 01-2.32-1.924C3.508 12.903 2.25 11.017 2.25 8.712A6.75 6.75 0 019 1.962zm0 1.5a5.25 5.25 0 00-5.25 5.25c0 1.741.954 3.27 2.153 4.497A13.508 13.508 0 007.57 14.64l.343.245c.111.077.218.149.32.216l.293.187.257.157.217.127.341-.202.276-.173c.146-.093.303-.197.47-.313l.343-.244c.594-.431 1.151-.91 1.667-1.432 1.199-1.227 2.153-2.756 2.153-4.497A5.25 5.25 0 009 3.462zm0 2.25a3 3 0 110 6 3 3 0 010-6zm0 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
          fill="#000"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3765_2433">
          <Path fill="#fff" transform="translate(0 .462)" d="M0 0H18V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default LocationIcon3
