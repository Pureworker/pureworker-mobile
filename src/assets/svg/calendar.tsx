import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function CalendarIcon(props) {
  return (
    <Svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3686_3790)" fill="#fff">
        <Path d="M10.875 12h-9.75A1.123 1.123 0 010 10.875v-9C0 1.252.502.75 1.125.75h9.75C11.498.75 12 1.252 12 1.875v9c0 .623-.502 1.125-1.125 1.125zM1.125 1.5a.371.371 0 00-.375.375v9c0 .21.165.375.375.375h9.75c.21 0 .375-.165.375-.375v-9a.371.371 0 00-.375-.375h-9.75z" />
        <Path d="M3.375 3A.371.371 0 013 2.625V.375C3 .165 3.165 0 3.375 0s.375.165.375.375v2.25c0 .21-.165.375-.375.375zm5.25 0a.371.371 0 01-.375-.375V.375c0-.21.165-.375.375-.375S9 .165 9 .375v2.25c0 .21-.165.375-.375.375zm3 1.5H.375A.371.371 0 010 4.125c0-.21.165-.375.375-.375h11.25c.21 0 .375.165.375.375s-.165.375-.375.375z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3686_3790">
          <Path fill="#fff" d="M0 0H12V12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default CalendarIcon;
