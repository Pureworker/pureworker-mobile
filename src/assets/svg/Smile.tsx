import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SmileIcon(props) {
  return (
    <Svg
      width={31}
      height={32}
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.5 31.5C24.06 31.5 31 24.56 31 16 31 7.44 24.06.5 15.5.5 6.94.5 0 7.44 0 16c0 8.56 6.94 15.5 15.5 15.5z"
        fill="#FFBF0B"
      />
      <Path
        d="M15.5 31.5C24.06 31.5 31 24.56 31 16 31 7.44 24.06.5 15.5.5 6.94.5 0 7.44 0 16c0 8.56 6.94 15.5 15.5 15.5z"
        fill="#FFBF0B"
      />
      <Path
        d="M15.5 22.781a3.886 3.886 0 01-3.875-3.875V16.97c0-.533.436-.969.969-.969h5.812c.533 0 .969.436.969.969v1.937a3.886 3.886 0 01-3.875 3.875z"
        fill="#1A1A54"
      />
      <Path
        d="M15.5 22.781c1.308 0 2.47-.63 3.148-1.647-.726-.968-1.84-1.598-3.148-1.598s-2.422.63-3.148 1.598c.678 1.017 1.84 1.647 3.148 1.647zM29.014 9.994c.872-1.696.872-3.633-.484-4.99-1.357-1.356-4.07-1.113-4.99.824-.871-1.937-3.584-2.18-4.94-.823-1.356 1.356-1.55 3.051-.678 4.843 1.501 3.1 4.165 4.602 5.231 5.086.29.146.581.146.824 0 1.017-.532 3.584-2.082 5.037-4.94zM13.03 9.994c.872-1.696.872-3.633-.485-4.99-1.356-1.356-4.068-1.113-4.989.824-.872-1.937-3.584-2.18-4.94-.823-1.357 1.356-1.55 3.051-.679 4.843 1.502 3.1 4.166 4.602 5.232 5.086.29.146.581.146.823 0 1.017-.532 3.585-2.082 5.038-4.94z"
        fill="#DC2863"
      />
    </Svg>
  );
}

export default SmileIcon;
