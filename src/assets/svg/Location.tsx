import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Location(props) {
  return (
    <Svg
      width={18}
      height={26}
      viewBox="0 0 18 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M16.896 8.75c0 6.802-7.948 15.5-7.948 15.5S1 15.714 1 8.75c0-4.142 3.558-7.5 7.948-7.5 4.39 0 7.948 3.358 7.948 7.5z"
        stroke="#000413"
        strokeWidth={1.7647}
        strokeMiterlimit={10}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Location;
