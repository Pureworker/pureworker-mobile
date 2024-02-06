import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import images from '../constants/images';
import colors from '../constants/colors';

type ReviewProps = {
  size?: boolean
  editable?: boolean
  value: number
}

const Review = ({ editable, value, size }: ReviewProps) => {
  const [selectReview, setReviewSelect] = useState(value ? value : 0);

  if (!editable && editable !== false) {
    editable = true;
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((starData, index) => (
        <View key={starData}>
          <TouchableOpacity
            disabled={!editable}
            style={{ marginRight: 3 }}
            onPress={() => setReviewSelect(starData)}>
            {starData < selectReview || starData == selectReview ? (
              <Image
                source={size ? images.star_2 : images.star}
                style={{
                  tintColor: '#FFC727',
                  height: size ? 34 : 12,
                  width: size ? 34 : 12,
                }}
              />
            ) : (
                <Image
                  source={size ? images.star_2 : images.star}
                  style={{
                    tintColor: colors.grey,
                    height: size ? 34 : 12,
                    width: size ? 34 : 12,
                  }}
                />
              )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default Review;
// import React, {useState} from 'react';
// import {Image, TouchableOpacity, View} from 'react-native';

// import images from '../constants/images';
// import colors from '../constants/colors';

// type ReviewProps = {
//   size?: boolean;
//   editable?: boolean;
//   value: number;
// };

// const Review = ({editable, value, size}: ReviewProps) => {
//   const [selectReview, setReviewSelect] = useState(value ? value : 0);

//   if (!editable && editable !== false) {
//     editable = true;
//   }

//   return (
//     <View style={{flexDirection: 'row'}}>
//       {[1, 2, 3, 4, 5].map((starData, index) => (
//         <View key={starData}>
//           <TouchableOpacity
//             disabled={!editable}
//             style={{marginRight: 3}}
//             onPress={() => setReviewSelect(starData)}>
//             {starData < selectReview || starData == selectReview ? (
//               <Image
//                 source={size ? images.star_2 : images.star}
//                 style={{
//                   tintColor: '#FFC727',
//                   height: size ? 34 : 12,
//                   width: size ? 34 : 12,
//                 }}
//               />
//             ) : (
//               <Image
//                 source={size ? images.star_2 : images.star}
//                 style={{
//                   tintColor: colors.grey,
//                   height: size ? 34 : 12,
//                   width: size ? 34 : 12,
//                 }}
//               />
//             )}
//           </TouchableOpacity>
//         </View>
//       ))}
//       {/* Add half star if rating is not a whole number */}
//       {selectReview % 1 !== 0 && (
//         <TouchableOpacity
//           disabled={!editable}
//           style={{marginRight: 3}}
//           onPress={() => setReviewSelect(Math.floor(selectReview) + 0.5)}>
//           <Image
//             source={size ? images.star_2 : images.star}
//             style={{
//               tintColor: '#FFC727',
//               height: size ? 34 : 12,
//               width: size ? 34 : 12,
//             }}
//           />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default Review;
