import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TipProvider(props) {
  return (
    <Svg
      width={10}
      height={11}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M1.25 5.5a3.75 3.75 0 107.5 0 3.75 3.75 0 00-7.5 0z"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.167 4.25a.833.833 0 00-.75-.417h-.834a.833.833 0 000 1.667h.834a.833.833 0 110 1.667h-.834a.833.833 0 01-.75-.417M5 3.417v4.166"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TipProvider;
