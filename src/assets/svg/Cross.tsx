import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Cross(props) {
  return (
    <Svg
      width={10}
      height={11}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2.903.068l2.054 3.47h.08L7.098.068h2.432L6.423 5.16 9.6 10.25H7.124L5.036 6.775h-.08L2.87 10.25H.403l3.186-5.09L.462.067h2.441z"
        fill="#000413"
      />
    </Svg>
  );
}

export default Cross;
