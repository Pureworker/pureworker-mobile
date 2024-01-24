import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function AddCircle(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 8v8m4-4H8"
        stroke="#88087B"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z"
        stroke="#88087B"
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export default AddCircle;
