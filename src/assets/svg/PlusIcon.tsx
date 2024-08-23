import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PlusIcon(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0,0,256,256"
      width="24px"
      height="24px"
      {...props}>
      <Path
        d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"
        transform="scale(10.66667)"
        fill="#2d303c"
        fillRule="evenodd"
        strokeMiterlimit={10}
        fontFamily="none"
        fontWeight="none"
        fontSize="none"
        textAnchor="none"
      />
    </Svg>
  );
}

export default PlusIcon;
