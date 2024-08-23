import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function USA1(props: any) {
  return (
    <Svg
      width={54}
      height={41}
      viewBox="0 0 28 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3910_848)">
        <Path d="M0 0h28v21.5H0" fill="#BD3D44" />
        <Path
          d="M0 2.477h28H0zm0 3.301h28H0zm0 3.315h28H0zm0 3.314h28H0zm0 3.315h28H0zm0 3.315h28H0z"
          fill="#000"
        />
        <Path
          d="M0 2.477h28M0 5.778h28M0 9.093h28M0 12.407h28M0 15.722h28M0 19.037h28"
          stroke="#fff"
          strokeWidth={2}
        />
        <Path d="M0 0h15.96v11.579H0" fill="#192F5D" />
      </G>
      <Defs>
        <ClipPath id="clip0_3910_848">
          <Path fill="#fff" d="M0 0H28V21.5H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default USA1;
