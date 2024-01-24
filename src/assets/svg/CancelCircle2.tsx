import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CancelCircle2(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M21.84 11.52a9.6 9.6 0 10-19.2 0 9.6 9.6 0 0019.2 0z"
        fill="#88087B"
        stroke="#88087B"
        strokeWidth={1.44}
      />
      <Path
        d="M15.12 14.4L9.36 8.64m0 5.76l5.76-5.76"
        stroke="#EBEBEB"
        strokeWidth={1.44}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default CancelCircle2;
