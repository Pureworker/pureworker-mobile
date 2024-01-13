import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CancelCircle(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.656 2.344A7.973 7.973 0 0116 8a7.968 7.968 0 01-2.344 5.656A7.973 7.973 0 018 16a7.968 7.968 0 01-5.656-2.344A7.973 7.973 0 010 8c0-2.128.838-4.153 2.344-5.656A7.973 7.973 0 018 0c2.128 0 4.153.838 5.656 2.344zM8 7.637l3.503-3.503a.257.257 0 01.363.363L8.363 8l3.503 3.503a.257.257 0 01-.363.363L8 8.363l-3.503 3.503a.257.257 0 01-.363-.363L7.637 8 4.135 4.497a.257.257 0 01.363-.363L8 7.637z"
        fill="#000"
      />
    </Svg>
  );
}

export default CancelCircle;
