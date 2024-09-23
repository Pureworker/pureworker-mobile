import * as React from "react"
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg"

function CoinIcon2(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={7.50525}
        cy={7.50525}
        r={7.3817}
        stroke="url(#paint0_linear_5043_1330)"
        strokeWidth={0.247097}
      />
      <Circle
        cx={7.50545}
        cy={7.5356}
        r={5.38642}
        stroke="url(#paint1_linear_5043_1330)"
        strokeWidth={0.185323}
      />
      <Circle
        cx={7.50525}
        cy={7.50525}
        r={6.48597}
        fill="#FEC424"
        stroke="url(#paint2_linear_5043_1330)"
        strokeWidth={2.03855}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_5043_1330"
          x1={6.02841}
          y1={-2.5503e-8}
          x2={7.85353}
          y2={15.0105}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFF3C4" />
          <Stop offset={0.483894} stopColor="#EDC071" />
          <Stop offset={0.961122} stopColor="#BF8147" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_5043_1330"
          x1={6.13795}
          y1={2.05652}
          x2={11.0849}
          y2={11.82}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#C8892B" />
          <Stop offset={0.979601} stopColor="#FFEDA3" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_5043_1330"
          x1={12.8869}
          y1={1.96234}
          x2={2.95749}
          y2={13.4129}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FED64A" />
          <Stop offset={0.123016} stopColor="#FEF14E" />
          <Stop offset={0.248796} stopColor="#FFDF6C" />
          <Stop offset={0.482583} stopColor="#FCFF67" />
          <Stop offset={0.743348} stopColor="#FED545" />
          <Stop offset={0.82597} stopColor="#FECA45" />
          <Stop offset={1} stopColor="#FEED44" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default CoinIcon2
