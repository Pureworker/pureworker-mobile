import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RewardIcon(props) {
  return (
    <Svg
      width={20}
      height={21}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.375 2.961A1.875 1.875 0 002.5 4.836v1.492c0 .65.337 1.252.889 1.593L8.22 10.91a3.75 3.75 0 103.558 0L16.61 7.92a1.874 1.874 0 00.889-1.593V4.836a1.875 1.875 0 00-1.875-1.875H4.375zM3.75 4.836a.625.625 0 01.625-.625H6.25v4.01L4.046 6.86a.625.625 0 01-.296-.531V4.836zM7.5 8.994V4.21h5v4.783l-2.171 1.342a.625.625 0 01-.658 0L7.5 8.994zm6.25-.773v-4.01h1.875a.625.625 0 01.625.625v1.492a.626.626 0 01-.296.53L13.75 8.222zm-6.25 5.99a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z"
        fill="#000"
      />
    </Svg>
  )
}

export default RewardIcon
