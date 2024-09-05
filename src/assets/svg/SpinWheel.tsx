import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function SpinWheel(props) {
    return (
        <Svg
            width={30}
            height={30}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clipPath="url(#clip0_5154_3921)" stroke="#000" strokeWidth={1.5}>
                <Path d="M10 11.667a1.667 1.667 0 100-3.334 1.667 1.667 0 000 3.334z" />
                <Path
                    d="M5 10h3.334m3.333 0H15m-7.5 4.33l1.667-2.887m1.667-2.886L12.5 5.67m0 8.66l-1.666-2.887M9.167 8.557L7.5 5.67M5.834 2.782a8.333 8.333 0 11-3.052 3.052M12.5 14.33a5 5 0 111.831-1.83"
                    strokeLinecap="round"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_5154_3921">
                    <Path fill="#fff" d="M0 0H20V20H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default SpinWheel
