import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Chat(props) {
  return (
    <Svg
      width={22}
      height={20}
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M17.813 2.625c.643 0 1.187.544 1.187 1.188v8.312c0 .644-.544 1.188-1.188 1.188H7.329l-.203.203v-.203H3.562a1.204 1.204 0 01-1.187-1.188V3.813c0-.644.544-1.188 1.188-1.188h14.25zm0-2.375H3.563A3.573 3.573 0 000 3.813v8.312a3.573 3.573 0 003.563 3.563H4.75v3.562l3.563-3.562h9.5a3.573 3.573 0 003.562-3.563V3.813A3.573 3.573 0 0017.812.25z"
        fill="#000413"
      />
    </Svg>
  );
}

export default Chat;
