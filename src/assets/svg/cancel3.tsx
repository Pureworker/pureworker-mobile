import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function CancelIcon(props) {
  return (
    <Svg
      width={18}
      height={20}
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3664_2533)">
        <Path
          d="M.758 12.493L6.001 7.25l5.243 5.243m0-10.486L6 7.25.758 2.007"
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3664_2533">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0H12V13H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default CancelIcon;
