import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ContactSupportIcon(props) {
  return (
    <Svg
      width={20}
      height={19}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2 15.5a4 4 0 014-4h8a4 4 0 014 4 2 2 0 01-2 2H4a2 2 0 01-2-2z"
        stroke="#000"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Path
        d="M10 7.5a3 3 0 100-6 3 3 0 000 6z"
        stroke="#000"
        strokeWidth={2.5}
      />
    </Svg>
  );
}

export default ContactSupportIcon;
