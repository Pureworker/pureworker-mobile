import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Checked(props) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 0a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V2a2 2 0 00-2-2H2zm11.95 6.796a1 1 0 00-1.414-1.415l-4.95 4.95L5.465 8.21A1 1 0 004.05 9.624l2.758 2.758a1.1 1.1 0 001.556 0l5.586-5.586z"
        fill="#FFCD1E"
      />
    </Svg>
  );
}

export default Checked;
